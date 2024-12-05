import sys
print("Python Executable:", sys.executable)
print("Python Path:", sys.path)
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
    try:
        client_id = str(uuid.uuid4())
        ws = websocket.WebSocket()
        ws.connect(f"ws://{server_address}/ws?clientId={client_id}")
        print(f"Connected to ComfyUI at ws://{server_address}")
        return ws, server_address, client_id
    except Exception as e:
        print(f"Failed to connect to ComfyUI at {server_address}: {e}")
        sys.exit(1)  # Exit if connection fails

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
    try:
        # Load workflow from file
        with open(workflow_path, 'r') as file:
            workflow = json.load(file)
        print("Loaded Workflow:", workflow)

        # Validate workflow structure
        if not isinstance(workflow, dict) or 'nodes' not in workflow:
            print("Error: Invalid workflow structure. Expected a dictionary with a 'nodes' key.")
            return

        # Establish connection
        ws, server_address, client_id = open_websocket_connection()

        # Assign a unique seed for randomness to KSampler nodes, if present
        for node in workflow['nodes']:
            if node.get('type') == 'KSampler':
                # Ensure inputs exist and is a dictionary
                inputs = node.setdefault('inputs', {})
                if isinstance(inputs, dict):
                    inputs['seed'] = random.randint(10**14, 10**15 - 1)
                else:
                    print(f"Warning: 'inputs' for node ID {node.get('id')} is not a dictionary.")
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
    except FileNotFoundError:
        print(f"The workflow file {workflow_path} was not found.")
    except json.JSONDecodeError:
        print(f"The workflow file {workflow_path} contains invalid JSON.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        ws.close()

# ---------------------------------------------------------------------------------------------------------------
# Example Usage

# Replace './workflows/example_workflow.json' with the path to your workflow file
start_workflow('./Image2Video.json')
