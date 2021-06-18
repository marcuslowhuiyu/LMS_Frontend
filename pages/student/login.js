import Head from 'next/head'
import { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

import { AuthContext } from '../../contexts/Auth.Context'

const StudentLogin = () => {
    const router = useRouter()

    const {auth, setAuth} = useContext(AuthContext)
    const [code, setCode] = useState()
    const [index, setIndex] = useState()

    const [invalidInput, setInvalidInput] = useState(false)

    const loginUser = (e) => {
        e.preventDefault()
        // Validation
        if ((code.length !== 6) | (isNaN(index))) {
            setInvalidInput(true)
            return
        } else setInvalidInput(false)

        setAuth({...auth, loading: true})

        console.log('ran')
        axios.post(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE+'auth/token/', {
            "username":code+'_'+index, "password":index
        }, { headers: {'Content-Type': 'application/json'}})
        .then(res => {
            setAuth({ loading: false, isAuthenticated: true, tokens: res.data, userType: "student" })
        })
        .catch(res => {
            console.log('login failed')
        })
    }

    useEffect(() => {
        if (auth.isAuthenticated) router.push('/student/')
    }, [auth])

    return (
        <div>
            <Head>
                <title>Login | LMS</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="pt-8 px-8 bg-white">
                { invalidInput && <p className="py-2 px-2 border-2 border-red-500 rounded-lg font-bold text-red-500">Invalid inputs.</p>}

                <h1 className="text-5xl my-6">Login for Students</h1>

                <form onSubmit={e => loginUser(e)}>
                    <label>
                        <p>Classroom Code:</p>
                        <input className="border-2" type="text" name="code" onChange={e => setCode(e.target.value)} />
                    </label>
                    <label>
                        <p>Index:</p>
                        <input className="border-2" type="text" name="index" onChange={e => setIndex(e.target.value)} />
                    </label>
                    <br />
                    <button type="submit" className="bg-gray-500 text-white mt-2 py-2 px-2 rounded-lg">Submit</button>
                </form>
            </main>

            <footer>
            </footer>
        </div>
    )
}

export default StudentLogin
