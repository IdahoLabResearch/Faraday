import json


def parse_jsonb(obj):
    """
    Parse the 'data' entry of an object into a JSON object.

    Args:
        obj (dict): The object to parse.
    Returns:
        dict: The object with the 'data' entry parsed into a JSON object.
    """
    if obj['data'] is not None:
        try:
            obj['data'] = json.loads(obj['data'])
        except json.JSONDecodeError as e:
            print(f"Error parsing 'data' entry: {e}")

    if obj['metadata'] is not None:
        try:
            obj['metadata'] = json.loads(obj['metadata'])
        except json.JSONDecodeError as e:
            print(f"Error parsing 'metadata' entry: {e}")

    return obj
