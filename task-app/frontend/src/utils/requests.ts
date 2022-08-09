import axios from 'axios';
import "node"; 

export const signUp = async (user: any) => {

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/signup`, {
            userName: user.userName,
            password: user.password,
            phoneNumber: user.phoneNumber,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,    
            birthDate: user.birthDate
        })
        return response.status
    }
    catch(err) {
        return 500
    }
}

export const confirm = async (userName: string, code: string) => {

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/confirm`, {
            userName: userName,
            code: code
        })
        return response.status
    }
    catch(err) {
        return 500
    }
}

export const login = async (userName: string, password: string) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth`, {
            userName: userName,
            password: password
        })
        return response.data
    }
    catch(err) {
        return 500
    }
}

export const getUser = async (userName: string, token: string) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/${userName}`, {
            headers: {
                "Authorization": token
            }
        })
        return response.data
    }
    catch(err) {
        return 500
    }
}

export const createTask = async (userName: string, taskId: string, taskName: string, dueDate: string, numComponents: string) => {

    try {
        const data = new FormData()
        data.append('taskId', taskId)
        data.append('taskName', taskName)
        // data.append('dueDate', dueDate)
        // data.append('numComponents', numComponents)

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/createTask/${userName}`, data)
        return response.data
    }
    catch(err) {
        return 500
    }
}

export const getTasks = async (userName: string) => {

    try {
        const fullSearch = await axios.get(`${process.env.REACT_APP_API_URL}/tasks/${userName}`)
        return fullSearch.data.message
    }
    catch(err) {
        return []
    }

}