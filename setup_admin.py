import urllib.request
import json
import ssl

# Bypass SSL verification if needed (for localhost)
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

BASE_URL = "http://localhost:9090"
REALM = "event-ticket-platform"
ADMIN_USER = "admin"
ADMIN_PASS = "admin"

def get_admin_token():
    url = f"{BASE_URL}/realms/master/protocol/openid-connect/token"
    data = f"client_id=admin-cli&username={ADMIN_USER}&password={ADMIN_PASS}&grant_type=password".encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/x-www-form-urlencoded'})
    with urllib.request.urlopen(req, context=ctx) as response:
        return json.load(response)['access_token']

def create_role(token, role_name):
    url = f"{BASE_URL}/admin/realms/{REALM}/roles"
    data = json.dumps({"name": role_name}).encode('utf-8')
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req, context=ctx) as response:
            print(f"Role {role_name} created.")
    except urllib.error.HTTPError as e:
        if e.code == 409:
            print(f"Role {role_name} already exists.")
        else:
            raise

def create_user(token, username, password):
    url = f"{BASE_URL}/admin/realms/{REALM}/users"
    user_data = {
        "username": username,
        "enabled": True,
        "emailVerified": True,
        "firstName": "Admin",
        "lastName": "User",
        "email": "admin@example.com",
        "credentials": [{
            "type": "password",
            "value": password,
            "temporary": False
        }]
    }
    data = json.dumps(user_data).encode('utf-8')
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req, context=ctx) as response:
            print(f"User {username} created.")
    except urllib.error.HTTPError as e:
        if e.code == 409:
            print(f"User {username} already exists.")
        else:
            raise

def get_user_id(token, username):
    url = f"{BASE_URL}/admin/realms/{REALM}/users?username={username}"
    headers = {'Authorization': f'Bearer {token}'}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as response:
        users = json.load(response)
        for user in users:
            if user['username'] == username:
                return user['id']
    return None

def get_role_id(token, role_name):
    url = f"{BASE_URL}/admin/realms/{REALM}/roles/{role_name}"
    headers = {'Authorization': f'Bearer {token}'}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as response:
        return json.load(response) # Returns role object

def assign_role(token, user_id, role_obj):
    url = f"{BASE_URL}/admin/realms/{REALM}/users/{user_id}/role-mappings/realm"
    data = json.dumps([role_obj]).encode('utf-8')
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')
    with urllib.request.urlopen(req, context=ctx) as response:
        print("Role assigned successfully.")

try:
    token = get_admin_token()
    print("Got admin token.")
    
    create_role(token, "ROLE_ADMIN")
    create_user(token, "admin", "password")
    
    user_id = get_user_id(token, "admin")
    role_obj = get_role_id(token, "ROLE_ADMIN")
    
    if user_id and role_obj:
        assign_role(token, user_id, role_obj)
        print("SETUP COMPLETE")
    else:
        print("Failed to find user or role to assign.")

except Exception as e:
    print(f"Error: {e}")
