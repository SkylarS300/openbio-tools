import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter()

class InteractionRequest(BaseModel):
    gene: str

class Node(BaseModel):
    id: str
    label: str
    description: str

class Edge(BaseModel):
    source: str
    target: str
    score: float

class InteractionResponse(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

@router.post("/interactions/fetch", response_model=InteractionResponse)
def fetch_interactions(data: InteractionRequest):
    gene = data.gene.upper()
    try:
        # STEP 1: Get STRING ID for input gene
        id_url = "https://string-db.org/api/json/get_string_ids"
        id_params = {
            "identifiers": gene,
            "species": 9606,
            "limit": 1,
            "caller_identity": "openbio-tools"
        }
        id_response = requests.get(id_url, params=id_params)
        if id_response.status_code != 200:
            raise HTTPException(status_code=502, detail="Failed to map STRING ID")

        id_data = id_response.json()
        if not id_data:
            raise HTTPException(status_code=404, detail="Gene not found in STRING")

        string_id = id_data[0]["stringId"]

        # STEP 1.5: Get redirect URL
        view_url = f"https://string-db.org/cgi/network.pl?identifier={string_id}&species=9606"


        # STEP 2: Fetch interactions using that STRING ID
        net_url = "https://string-db.org/api/json/network"
        net_params = {
            "identifiers": string_id,
            "species": 9606,
            "limit": 30,
            "required_score": 700,
            "caller_identity": "openbio-tools"
        }
        net_response = requests.get(net_url, params=net_params)
        if net_response.status_code != 200:
            raise HTTPException(status_code=502, detail="Failed to fetch network")

        interactions = net_response.json()
        if not interactions:
            raise HTTPException(status_code=404, detail="No interactions found")

        # STEP 3: Collect all unique protein names
        unique_names = set()
        for item in interactions:
            unique_names.add(item["preferredName_A"])
            unique_names.add(item["preferredName_B"])

        # STEP 4: Fetch STRING IDs + descriptions for all proteins
        batch_params = {
            "identifiers": "%0d".join(unique_names),
            "species": 9606,
            "caller_identity": "openbio-tools"
        }
        batch_response = requests.get(id_url, params=batch_params)
        if batch_response.status_code != 200:
            raise HTTPException(status_code=502, detail="Failed to fetch protein annotations")

        batch_data = batch_response.json()
        desc_map = {}
        for entry in batch_data:
            name = entry.get("preferredName")
            desc = entry.get("annotation") or "No description available"
            if name:
                desc_map[name] = desc

        # STEP 5: Build nodes and edges
        nodes = {}
        edges = []

        for item in interactions:
            n1 = item["preferredName_A"]
            n2 = item["preferredName_B"]
            score = float(item.get("score", 0.0))
            score = min(score, 0.99)

            for name in (n1, n2):
                if name not in nodes:
                    nodes[name] = {
                        "id": name,
                        "label": name,
                        "description": desc_map.get(name, "No description available")
                    }

            edges.append({
                "source": n1,
                "target": n2,
                "score": round(score, 3),
                "label": f"{score:.2f}"
            })

        # STEP 6: Optional debug print
        print("Sample node response:")
        print(nodes)

        # STEP 7: Build a view-in-STRING link for the central protein
        link_url = "https://string-db.org/api/json/get_link"
        link_params = {
            "identifiers": string_id,
            "species": 9606,
            "caller_identity": "openbio-tools"
        }
        link_response = requests.get(link_url, params=link_params)
        view_url = None
        if link_response.status_code == 200:
            link_data = link_response.json()
            if link_data and "stringUrl" in link_data[0]:
                view_url = link_data[0]["stringUrl"]


        return {
            "nodes": list(nodes.values()),
            "edges": edges,
            "view_url": view_url
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
