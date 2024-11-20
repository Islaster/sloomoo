import websocket
import uuid
import json
import random

# ---------------------------------------------------------------------------------------------------------------------
# Establish Connection

def open_websocket_connection():
    """
    Establish a websocket connection to ComfyUI.
    """
    server_address = '127.0.0.1:8188'
    client_id = str(uuid.uuid4())

    ws = websocket.WebSocket()
    ws.connect(f"ws://{server_address}/ws?clientId={client_id}")
    return ws, server_address, client_id

# ---------------------------------------------------------------------------------------------------------------------
# Send Workflow and Start

def start_workflow(workflow_path):
    """
    Loads a workflow from file and sends it to ComfyUI to start the workflow.

    Args:
        workflow_path (str): Path to the workflow JSON file.

    Returns:
        None
    """
    # Load workflow from file
    try:
        with open(workflow_path, 'r') as file:
            workflow = json.load(file)
    except FileNotFoundError:
        print(f"The workflow file {workflow_path} was not found.")
        return
    except json.JSONDecodeError:
        print(f"The workflow file {workflow_path} contains invalid JSON.")
        return

    # Establish connection
    try:
        ws, server_address, client_id = open_websocket_connection()

        # Assign a unique seed for randomness if required
        for key, value in workflow.items():
            if value['class_type'] == 'KSampler':
                workflow[key]['inputs']['seed'] = random.randint(10**14, 10**15 - 1)
                break

        # Send workflow and queue it for execution
        request = {
            "type": "queue_prompt",
            "data": {
                "prompt": workflow,
                "client_id": client_id
            }
        }
        ws.send(json.dumps(request))
        print("Workflow has been sent and queued for execution.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        ws.close()

# ---------------------------------------------------------------------------------------------------------------
# Example Usage

# Replace './workflows/example_workflow.json' with the path to your workflow file
start_workflow('./Image2Video.json')
