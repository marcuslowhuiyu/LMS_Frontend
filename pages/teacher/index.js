import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Popup from "reactjs-popup";

import { AuthContext } from "../../contexts/Auth.Context";
import { ClassroomsContext } from "../../contexts/Classrooms.Context";

const contentStyle = { paddingLeft: "0.5rem", paddingRight: "0.5rem" };

const TeacherHome = () => {
  const router = useRouter();
  const { auth, setAuth, getAccessToken } = useContext(AuthContext);
  const { classrooms, setClassrooms } = useContext(ClassroomsContext);

  useEffect(() => {
    // Get classrooms
    if (auth.tokens) {
      getAccessToken().then((accessToken) => {
        axios
          .get(process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + "core/classrooms/", {
            headers: { Authorization: "Bearer " + accessToken },
          })
          .then((res) => {
            setClassrooms(res.data);
          })
          .catch((res) => {
            console.log(res);
          });
      });
    }
  }, [auth.tokens]);

  const sortClassrooms = (classes) => {
    return classes.sort((a, b) =>
      a.status > b.status ? 1 : b.status > a.status ? -1 : 0
    );
  };

  const createClass = ({ formName, formStudents }) => {
    getAccessToken().then((accessToken) => {
      axios
        .post(
          process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + "core/classrooms/",
          {
            name: formName,
            no_of_students: formStudents > 1 ? parseInt(formStudents) : 1,
          },
          {
            headers: { Authorization: "Bearer " + accessToken },
          }
        )
        .then((res) => {
          let classroom = res.data;
          setClassrooms([...classrooms, classroom]);
        })
        .catch((res) => {
          console.log(res);
        });
    });
  };

  return (
    <div>
      <Head>
        <title>Teacher | EchoClass</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/mini_logo.ico" />
      </Head>

      <main className="pt-8 px-8 bg-white">
        <div className="flex flex-row items-center mb-4">
          <h2 className="text-4xl font-bold">Classrooms</h2>
          <CreateClassForm {...{ createClass }} />
        </div>

        {classrooms && classrooms.length === 0 && (
          <p className="italic text-gray-500 py-2">No classrooms found.</p>
        )}

        {classrooms &&
          sortClassrooms(classrooms).map((cr, i) => {
            return <Classroom classroom={cr} key={cr.id} />;
          })}
      </main>

      <footer></footer>
    </div>
  );
};

export default TeacherHome;

const Classroom = ({ classroom }) => {
  return (
    <Link href={"/teacher/class/" + classroom.code}>
      <div className="py-2 px-2 border-b-2 border-gray-200 hover:bg-gray-100 cursor-pointer">
        <div className="flex flex-row items-center">
          <p className="text-lg font-semibold mr-4">{classroom.name}</p>
          {classroom.status === 2 && (
            <p className="py-0.5 px-1 text-sm text-white bg-red-500 rounded">
              Archived
            </p>
          )}
        </div>
        <p className="text-gray-500">Code: {classroom.code}</p>
      </div>
    </Link>
  );
};

const CreateClassForm = ({ createClass }) => {
  const [formName, setFormName] = useState();
  const [formStudents, setFormStudents] = useState(1);
  const [formError, setFormError] = useState(false);

  return (
    <Popup
      trigger={
        <button className="ml-6 mt-1 px-2 py-1 rounded text-white text-sm bg-gray-500 hover:bg-gray-600 cursor-pointer">
          Create Class
        </button>
      }
      position="bottom right"
    >
      {(close) => (
        <div className="px-4 py-4 bg-gray-100 max-w-min shadow-lg">
          <h2 className="text-lg mb-4 text-center">Create a new class?</h2>
          <label>
            <p className="font-semibold">Name</p>
            <input
              className="mt-2 outline-none border-2 rounded"
              type="text"
              name="class_name"
              autoComplete="off"
              onChange={(e) => setFormName(e.target.value)}
            />
          </label>
          <br />
          {formError && (
            <p className="text-sm text-red-500">Class name cannot be empty.</p>
          )}
          <button
            className="mt-4 py-1 px-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            onClick={() => {
              if (!formName) {
                setFormError(true);
              } else {
                createClass({ formName, formStudents });
                close();
              }
            }}
          >
            Create
          </button>
        </div>
      )}
    </Popup>
  );
};
