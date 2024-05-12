import UserModal from "../models/user";


const userRepository:any = {};

userRepository.findByEmail = async (email : string)=>{
    return await UserModal.findOne({ email });
}
userRepository.findById = async (id : string)=>{
    return await UserModal.findById(id)
}
userRepository.createUser = async (userData:string) => {
    const newUser = new UserModal(userData);
    return await newUser.save();
  };

  export default userRepository;