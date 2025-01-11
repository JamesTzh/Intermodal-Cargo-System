from flask import Flask, jsonify, request, session
import json
import os
from flask_cors import CORS
from datetime import datetime
from openai import OpenAI

app = Flask(__name__)
CORS(app)  # Allow CORS from all origins

@app.route("/", methods=['GET'])
def send_dashboard():
    # Use os.path.join for the file path
    json_file_path = os.path.join(os.path.dirname(__file__), 'DB', 'optimized_clusters.json')

    try:
        with open(json_file_path, 'r') as f:
            data = json.load(f)  # Load JSON data from file

            ret_lst = []  # Prepare the response list
            for key, value in data.items():  # Iterate over the JSON object
                ret_lst.append(
                     {  'Name' : key ,
                        'Total_Load': value['Total_Load'],
                        'Max_Capacity': value['Max_Capacity'],
                        'Transport_Mode': value['Transport_Mode'],
                        'Shipping_Date': value['Shipping_Date']
                    }
                )

            return jsonify(ret_lst), 200  # Return the JSON response with status 200

    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404
    except json.JSONDecodeError:
        return jsonify({"error": "Error decoding JSON"}), 500

@app.route("/storage", methods=['POST'])
def send_storage():
    json_file_path = os.path.join(os.path.dirname(__file__), 'DB', 'optimized_clusters.json')
    try:
        # Get the 'id' from the JSON body
        data = request.get_json()
        id = data.get('id')  # Extract 'id' from the request
        with open(json_file_path, 'r') as f:
            data = json.load(f)  # Load JSON data from file
            cargos = data[id]
        return jsonify(cargos), 200  # Send response
    except Exception as e:
        return jsonify({'Status': "error", 'message': str(e)}),500

@app.route("/delete", methods=['POST'])
def delete():
    json_file_path = os.path.join(os.path.dirname(__file__), 'DB', 'optimized_clusters.json')

    try:
        postdata = request.get_json()
        cargo_id = postdata.get('id')
        cluster_name = postdata.get('cluster')

        print(f"Received ID: {cargo_id}, Cluster: {cluster_name}")
    
        # Open the JSON file and load the data
        with open(json_file_path, 'r') as f:
            data = json.load(f)

            if cluster_name in data:
                # Filter out the cargo item with the specified CargoID
                original_length = len(data[cluster_name]["Items"])
                lst = []
                for item in data[cluster_name]["Items"]:
                    if item["CargoID"] != int(cargo_id):
                        lst.append(item)
                    else:
                         data[cluster_name]["Total_Load"] = data[cluster_name]["Total_Load"] - item['Load']
                
                data[cluster_name]["Items"] = lst
                # Check if the deletion was successful
                if len(data[cluster_name]["Items"]) < original_length:
                    message = f"CargoID {cargo_id} deleted from {cluster_name}."
                    print(message)
                else:
                    message = f"CargoID {cargo_id} not found in {cluster_name}."
                    print(message)

            else:
                message = f"Cluster '{cluster_name}' not found in the data."
                print(message)
                return jsonify({'Status': "error", 'message': message}), 404

        # Save the updated data back to the JSON file
        with open(json_file_path, 'w') as f:
            json.dump(data, f, indent=4)

        return jsonify({'Status': "success", 'message': message}), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'Status': "error", 'message': str(e)}), 500
    
@app.route("/addcargo", methods=['POST'])
def add_cargo():
    if request.method == 'POST':
        try:
            # Get data from the form (or JSON from request body)
            item = request.get_json()
            if not item:
                raise ValueError("NO data")
            
            print(item)
            clusters = load_clusters()

            clus = add_item_to_cluster(item,clusters)
            print(clus)

            # Process the data (for example, assign a cluster)
            processed_data = {"Cluster": clus, "CargoID": item['CargoID'], "Destination": item['Destination_Country']}

            # Store the processed data in the session (or a database)
            print("Received and processed data:", processed_data)

            # Return success response
            return jsonify({"message": "Cargo added successfully!", "data": processed_data}), 200

        except Exception as e:
            # Handle any errors and return 500 status
            return jsonify({"error": str(e)}), 500

def load_clusters(file_path=os.path.join(os.path.dirname(__file__), 'DB', 'optimized_clusters.json')):
    with open(file_path, 'r') as f:
        return json.load(f)
    
def save_clusters(clusters,file_path=os.path.join(os.path.dirname(__file__), 'DB', 'optimized_clusters.json')):
    with open(file_path, 'w') as f:
        json.dump(clusters,f,indent=4)

def chatgpt_add_item(new_item,clusters):
    client = OpenAI() #Insert API Key here
  
    clus = {}
    for key in clusters:
        clus.update({  key : {
                            'Total_Load': clusters[key]['Total_Load'],
                            'Max_Capacity': clusters[key]['Max_Capacity'],
                            'Transport_Mode': clusters[key]['Transport_Mode'],
                            'Shipping_Date': clusters[key]['Shipping_Date'],
                            'Sample_country': clusters[key]["Items"][0]['Destination_Country']}})
    
    prompt = f"""
You are managing a logistics system focused on cost-efficiency and reducing carbon footprint. 



Below are the existing clusters of items:
{json.dumps(clus, indent=2)}

A new item has arrived:
{json.dumps(new_item, indent=2)}

**Transport Modes and Constraints:**
- Plane: Max 5000 kg, suitable only for tight deadlines (within 10 days).
- Ship: Max 10,000 kg, ideal for international shipments.
- Truck: Max 10,000 kg, only for Singapore.

**Rules:**
1. Add the item to an existing cluster if possible.
2. Create a new cluster only if the item doesn't fit into any existing cluster.
3. Ensure load does not exceed capacity for the transport mode.
4. Aim to reduce the number of plane trips to minimize carbon emissions.

Provide your response without reasoning and details as:
- "Add to [Cluster_Name]" if it fits an existing cluster.
- "Create new cluster [New_Cluster_Name]" if it needs a new cluster.
    """
    response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[{"role": "system", "content": "You are a logistics manager."},
                  {"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content

def add_item_to_cluster(new_item, clusters):
    decision = chatgpt_add_item(new_item, clusters)

    print(decision)
    
    if decision.startswith("Add to"):
        print('adding to cluster')
        cluster_name = decision.split(" ")[-1]
        print('adding smth')
        clusters[cluster_name]['Items'].append(new_item)
        print('adding to cluster')
        print("total load = ",
        clusters[cluster_name]['Total_Load'])
        print(new_item['Load'])
        clusters[cluster_name]['Total_Load'] += int(new_item['Load'])
        print('adding to cluster')
        print("reached here")
    elif decision.startswith("Create new cluster"):
        print('creating new cluster')
        cluster_name = decision.split(" ")[-1]
        clusters[cluster_name] = {
            "Items": [new_item],
            "Total_Load": new_item['Load'],
            "Max_Capacity": "Varies",
            "Transport_Mode": "Pending"
        }
    else:
        print("Invalid response from ChatGPT.")

    print("before saving")
    save_clusters(clusters)
    print("after saving")

    print("updated", cluster_name)
    return(cluster_name)


if __name__ == '__main__':
    app.run(debug=True)
