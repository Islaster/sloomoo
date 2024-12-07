import requests

def addToSlack():
    payload = {
        "text": "test"
    }
    response = requests.post(
        'https://hooks.slack.com/services/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',
        json=payload
    )
    if response.status_code == 200:
        print("Message sent successfully!")
    else:
        print(f"Failed to send message. Status code: {response.status_code}, Response: {response.text}")

addToSlack()