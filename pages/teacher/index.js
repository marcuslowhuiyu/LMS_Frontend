import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import Popup from 'reactjs-popup';

import { AuthContext } from '../../contexts/Auth.Context'
import { ClassroomsContext } from '../../contexts/Classrooms.Context'

const contentStyle = { paddingLeft: '0.5rem', paddingRight: '0.5rem' }

const TeacherHome = () => {
    const router = useRouter()
    const { auth, setAuth, getAccessToken } = useContext(AuthContext)
    const { classrooms, setClassrooms } = useContext(ClassroomsContext)

    const [formName, setFormName] = useState()
    const [formStudents, setFormStudents] = useState(0)

    useEffect(() => {
        // Get classrooms
        if (auth.tokens) {
            getAccessToken().then((accessToken) => {
                axios.get(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE+'core/classrooms/', {
                    headers: {'Authorization': 'Bearer '+accessToken},
                })
                .then(res => {
                    setClassrooms(res.data)
                })
                .catch(res => {
                    console.log(res)
                })
            })
        }
    }, [auth.tokens])

    const sortClassrooms = (classes) => {
        return classes.sort((a,b) => (a.status > b.status) ? 1 : ((b.status > a.status) ? -1 : 0))
    }

    const createClass = () => {
        getAccessToken().then((accessToken) => {
            axios.post(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE+'core/classrooms/', {
                "name": formName, "no_of_students": parseInt(formStudents)
            }, {
                headers: {'Authorization': 'Bearer '+accessToken},
            })
            .then(res => {
                let classroom = res.data
                setClassrooms([...classrooms, classroom])
                router.push('/teacher/class/'+classroom.code)
            })
            .catch(res => {
                console.log(res)
            })
        })
    }

    return (
        <div>
            <Head>
                <title>Teacher | LMS</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="pt-8 px-8 bg-white">
                <h1 className="text-5xl">Teacher Dashboard</h1>

                <div className="flex flex-row items-center">
                    <h2 className="text-3xl mt-8 mb-4">Classrooms</h2>
                    <CreateClassForm createClass={createClass} setFormName={setFormName} setFormStudents={setFormStudents} />
                </div>

                { classrooms && sortClassrooms(classrooms).map((cr, i) => {
                    return (<Classroom classroom={cr} key={i} />)
                })}


            </main>

            <footer>
            </footer>
        </div>
    )
}

export default TeacherHome

const Classroom = ({classroom}) => {
    return (
        <Link href={"/teacher/class/"+classroom.code}>
            <div className="py-2 px-2 border-b-2 hover:bg-gray-100 cursor-pointer">
                <div className="flex flex-row items-center">
                    <p className="text-lg font-semibold mr-4">{classroom.name}</p>
                    {classroom.status === 2 && <p className="py-0.5 px-1 text-sm text-white bg-red-500 rounded">Archived</p>}
                </div>
                <p className="text-gray-500">Code: {classroom.code}</p>
            </div>
        </Link>
    )
}

const CreateClassForm = ({ createClass, setFormName, setFormStudents }) => {
    return (
        <Popup
            trigger={<button className="ml-6 mt-5 px-2 py-1 rounded text-white text-sm bg-gray-500 hover:bg-gray-600 cursor-pointer">Create Class</button>}
            position="bottom right"
        >
            { close => (
                <div className="px-4 py-4 bg-gray-100 max-w-min">
                    <h2 className="text-xl mb-4">Create New Class</h2>
                    <label>
                        <p>Name:</p>
                        <input className="border-2 rounded" type="text" name="class_name" onChange={e => setFormName(e.target.value)} />
                    </label>
                    <label>
                        <p className="mt-2">No. of Students:</p>
                        <input className="border-2 rounded" type="number" min="1" name="number_of_students" onChange={e => setFormStudents(e.target.value)} />
                    </label><br />
                    <button className="mt-4 py-1 px-2 bg-gray-500 text-white rounded" onClick={() => {createClass(); close()}}>Create</button>
                </div>
            )}
        </Popup>

    )
}
