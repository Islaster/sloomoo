import json
from urllib import request, parse

# SIDE NOTE: if you wamt to run it locally you would need to install ComfyUI
# Function to queue a prompt to the ComfyUI API
def queue_prompt(prompt):
    p = {"prompt": prompt}
    data = json.dumps(p).encode('utf-8')
    req = request.Request("http://127.0.0.1:8188/prompt", data=data)
    response = request.urlopen(req)
    print("Prompt sent successfully:", response.read().decode('utf-8'))

# Load prompt from a JSON file
with open("workflow_api.json", "r") as file:
    prompt = json.load(file)

print('connecting to comfyui...')
# Queue the prompt
queue_prompt(prompt)
