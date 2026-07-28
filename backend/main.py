from fastapi import FastAPI

app = FastAPI(title="CommUnity API")

@app.get("/")
def read_root():
    return {"message": "CommUnity API is running"}