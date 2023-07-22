import { Request, Response } from 'express'
import User from '../db/models/user.model'
import jwt from 'jsonwebtoken'
import { AuthenticatedRequest } from '../types/express'
const JWT_SECRET = process.env.SECRET_PHRASE as string

export const userGet = async (req: Request, res: Response) => {
  try {
    const userData = await User.findById((req as AuthenticatedRequest).user.id).select('-password')

    return res.status(200).send({ message: 'Success', userData })
  } catch (error) {
    return res.status(500).send({ message: 'Something went wrong!', success: false })
  }
}

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, mobile, password } = req.body
    const isEmailExist = await User.findOne({ where: { email: email } })

    if (isEmailExist) return res.status(400).send({ message: 'email already exist!', success: false })

    const obj = {
      name,
      email,
      mobile,
      password,
      avtar: req.file?.path
    }

    const userdata = new User(obj)

    await userdata.save()

    res.status(200).send({ message: 'Successfully Created!', userdata })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: 'Something went wrong!', error })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) return res.status(404).send({ message: 'Credentials missing!', success: false })

    const userData = await User.findOne({ email: email })

    if (!userData) return res.status(404).send({ message: 'Wrong credentials!', success: false })

    const isPasswordMatch = await userData.comparePassword(password)

    if (!isPasswordMatch) return res.status(404).send({ message: 'Wrong credentials!', success: false })

    const token = jwt.sign({ id: userData.id, role: userData.role }, JWT_SECRET)

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    })
    res.status(200).send({ message: 'Successfully logged in!', token })
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong!', error })
  }
}
