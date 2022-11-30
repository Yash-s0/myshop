from flask import Flask
from flask_restful import Api, request
from sqlalchemy import create_engine, Column, Integer, String, inspect
from sqlalchemy.orm import sessionmaker
from passlib.hash import sha256_crypt
from sqlalchemy.ext.declarative import as_declarative, declared_attr
from flask_cors import CORS
import jwt
import datetime

# import requests

app = Flask(__name__)
api = Api(app)
CORS(app)
SECRET_KEY = "yashsecret"

dbEngine = create_engine("sqlite:///data.db")
Session = sessionmaker(bind=dbEngine)

# ENCODING THE AUTHORIZATION TOKEN
def encode_auth_token(user_id):
    payload = {
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=0, hours=3),
        "iat": datetime.datetime.utcnow(),
        "sub": user_id,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


# DECODING THE AUTHORIZATION TOKEN
def decode_auth_token(auth_token):
    try:
        payload = jwt.decode(auth_token, SECRET_KEY, algorithms=["HS256"])
        return {"success": True, "fullname": payload["sub"]}
    except jwt.ExpiredSignatureError:
        return {"success": False, "message": "Signature expired. Please log in again."}
    except jwt.InvalidTokenError:
        return {"success": False, "message": "Signature expired. Please log in again."}


@as_declarative()
class Base:
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()

    def _asdict(self):
        return {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}


class User(Base):
    __tablename__ = "user"
    user_id = Column(Integer, unique=True, primary_key=True)
    fullname = Column(String(200), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    contact_number = Column(Integer, unique=True, nullable=False)
    password = Column(String(200), nullable=False)


class Admin(Base):
    __tablename__ = "admin"
    id = Column(Integer, unique=True, primary_key=True)
    admin_name = Column(String(200), unique=True, nullable=False)
    password = Column(String(200), nullable=False)


class Flights(Base):
    __tablename__ = "flights"
    flight_id = Column(Integer, unique=True, primary_key=True)
    flight_name = Column(String(200), nullable=False)
    flight_from = Column(String(200), nullable=False)
    flight_to = Column(String(200))
    flight_class = Column(String(200))
    price = Column(Integer)
    date = Column(String(100))


class Bookings(Base):
    __tablename__ = "bookings"
    booking_id = Column(Integer, unique=True, primary_key=True)
    fullname = Column(String(200), nullable=False)
    email = Column(String(100), nullable=False)
    contact_number = Column(Integer, nullable=False)
    flight_name = Column(String(200), nullable=False)
    flight_from = Column(String(200), nullable=False)
    flight_to = Column(String(200))
    flight_class = Column(String(200))
    price = Column(Integer)
    date = Column(String(100))


# REGISTER NEW USER
@app.post("/register")
def register():
    args = request.json
    fullname = args.get("fullname")
    email = args.get("email")
    contact_number = args.get("contact_number")
    password = args.get("password")
    repassword = args.get("repassword")
    cap_name = fullname.capitalize()

    if repassword == password:
        return {"success": False, "message": "Passwords do not match."}

    if fullname is None:
        return {"success": False, "message": "Fullname is required!!!"}, 400

    if email is None:
        return {"success": False, "message": "Email is required!!!"}, 400

    if contact_number is None:
        return {"success": False, "message": "Contact Number is required!!!"}, 400

    if password is None:
        return {"success": False, "message": "Password is required!!!"}, 400

    hashed_pass = sha256_crypt.encrypt(password)
    db = Session()

    user = db.query(User).filter_by(email=email).first()
    if user:
        return {
            "success": False,
            "message": "Email already registered!!! Please Login...",
        }, 409

    user = db.query(User).filter_by(contact_number=contact_number).first()
    if user:
        return {
            "success": False,
            "message": "Contact Number already registered!!! Please Login...",
        }, 409

    new_user = User(
        fullname=cap_name,
        email=email,
        contact_number=contact_number,
        password=hashed_pass,
    )

    db.add(new_user)
    db.commit()
    db.close()

    return {"success": True, "message": "Successfully registerd!"}


# LOGIN USER
@app.post("/login")
def login():
    args = request.json
    email = args.get("email")
    password = args.get("password")

    db = Session()
    user = db.query(User).filter_by(email=email).first()
    if not user:
        return {
            "success": False,
            "message": "User does not exist!!! Please Register...",
        }

    verify_password = sha256_crypt.verify(password, user.password)

    if not verify_password:
        return {"success": False, "message": "Wrong password."}

    bearer_token = encode_auth_token(user.fullname)
    # print(bearer_token)
    db.close()
    return {"success": True, "bearer_token": bearer_token}


# Admin register
@app.post("/admin-register")
def AdminRegister():
    args = request.json
    admin_name = args.get("admin_name")
    code = args.get("code")
    password = args.get("password")
    cap_admin = admin_name.capitalize()

    if code != "7303325661":
        return {
            "success": False,
            "message": "You are not authorised to register as an admin.",
        }

    db = Session()
    admin = db.query(Admin).filter_by(admin_name=cap_admin).first()
    if admin:
        return {
            "success": False,
            "message": "Admin already exists!!! Please Login...",
        }, 409

    hashed_pass = sha256_crypt.encrypt(password)
    print(admin_name, code, password)

    new_admin = Admin(
        admin_name=cap_admin,
        password=hashed_pass,
    )

    db.add(new_admin)
    db.commit()
    db.close()

    return {"success": True, "message": "Successfully registerd!"}


# Admin login
@app.post("/admin-login")
def AdminLogin():
    args = request.json
    admin_name = args.get("admin_name")
    password = args.get("password")
    cap_admin = admin_name.capitalize()

    db = Session()
    admin = db.query(Admin).filter_by(admin_name=cap_admin).first()
    if not admin:
        return {
            "success": False,
            "message": "Admin does not exist!!! Please Register...",
        }

    verify_password = sha256_crypt.verify(password, admin.password)

    if not verify_password:
        return {"success": False, "message": "Wrong password."}

    bearer_token = encode_auth_token(admin.admin_name)
    # print(bearer_token)
    db.close()
    return {"success": True, "bearer_token": bearer_token}


# GET THE Authorization PROCESS DONE
@app.post("/admin-info")
def admin_info():
    print(request.headers)
    token = request.headers.get("Authorization")
    print(token)
    # return {"succes": False}
    if token is None:
        return {"success": False, "message": "Session expried, please login"}, 404

    bearer_token = token.split("Bearer ")[1]
    verify = decode_auth_token(bearer_token)
    print(verify)
    if "success" in verify and verify["success"] is False:
        return verify

    db = Session()
    user = db.query(Admin).filter_by(admin_name=verify["fullname"]).first()
    data = user._asdict()
    del data["password"]
    del data["id"]
    return data


# Add Flights
@app.post("/add-flight")
def AddFlight():
    token = request.headers.get("Authorization")
    if token is None:
        return {"success": False, "message": "Session expried, please login"}, 404

    bearer_token = token.split("Bearer ")[1]
    # print(bearer_token)
    verify = decode_auth_token(bearer_token)
    print(verify)
    if "success" in verify and verify["success"] is False:
        return verify

    db = Session()
    admin = db.query(Admin).filter_by(admin_name=verify["fullname"]).first()
    data = admin._asdict()
    del data["password"]
    del data["id"]
    logged_in_admin = data
    logged_in = logged_in_admin["admin_name"]
    print("logged in", logged_in)

    args = request.json
    flight_name = args.get("flight_name")
    flight_from = args.get("flight_from")
    flight_to = args.get("flight_to")
    flight_class = args.get("flight_class")
    price = args.get("price")
    date = args.get("date")

    flight = (
        db.query(Flights)
        .filter_by(
            flight_name=flight_name,
            flight_from=flight_from,
            flight_to=flight_to,
            price=price,
            date=date,
        )
        .first()
    )

    if flight:
        return {
            "success": False,
            "message": "Flight already added.",
        }, 409

    new_flight = Flights(
        flight_name=flight_name,
        flight_from=flight_from,
        flight_to=flight_to,
        flight_class=flight_class,
        price=price,
        date=date,
    )

    db.add(new_flight)
    db.commit()
    db.close()

    return {"success": True, "message": "Flight Added"}


# See Flights
@app.post("/")
def SeeFlights():
    # token = request.headers.get("Authorization")
    # if token is None:
    #     return {"success": False, "message": "Session expried, please login"}, 404

    # bearer_token = token.split("Bearer ")[1]
    # # print(bearer_token)
    # verify = decode_auth_token(bearer_token)
    # print(verify)
    # if "success" in verify and verify["success"] is False:
    #     return verify

    db = Session()
    # admin = db.query(Admin).filter_by(admin_name=verify["fullname"]).first()
    # data = admin._asdict()
    # del data["password"]
    # del data["id"]
    # logged_in_admin = data
    # logged_in = logged_in_admin["admin_name"]
    # print("logged in", logged_in)

    # USER LOGGED IN

    response = list()
    url_data = db.query(Flights).all()
    for row in url_data:
        data = row._asdict()
        response.append(data)

    return response


if __name__ == "__main__":
    Base.metadata.create_all(dbEngine)
    app.run(debug=True)
