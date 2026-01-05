pip install -r requirements.txt
uvicorn app.main:app --reload
http://localhost:8000/docs
python -m app.seed