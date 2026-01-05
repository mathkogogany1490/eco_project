from pydantic import BaseModel

class ContractCreate(BaseModel):
    name: str
    type: str
    company: str

class ContractOut(ContractCreate):
    id: int

    class Config:
        from_attributes = True
