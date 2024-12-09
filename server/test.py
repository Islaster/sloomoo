import requests

def send_response_to_endpoint(poem, prompt):
    """
    Sends data to the specified endpoint.

    Args:
        poem (str): The poem text
        prompt (str): The prompt text
    """
    payload = {
        "poem": poem,
        "prompt": prompt,
    }

    # Local server endpoint
    endpoint = 'http://localhost:3001/'

    try:
        # Send POST request
        response = requests.post(endpoint, json=payload)

        # Log the response
        print(f"Full URL: {endpoint}")
        print(f"Response status code: {response.status_code}")
        print(f"Response text: {response.text}")
    except requests.exceptions.RequestException as e:
        print("Error while sending data:", e)

# Test the function
send_response_to_endpoint("This is a test poem", "Write a test prompt")
