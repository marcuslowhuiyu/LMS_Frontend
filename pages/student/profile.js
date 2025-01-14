import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Popup from "reactjs-popup";

import { AuthContext } from "../../contexts/Auth.Context";
import { ClassroomsContext } from "../../contexts/Classrooms.Context";

const contentStyle = { paddingLeft: "0.5rem", paddingRight: "0.5rem" };

const StudentProfile = () => {
  const router = useRouter();
  const { auth, setAuth, getAccessToken } = useContext(AuthContext);
  const { classrooms, setClassrooms } = useContext(ClassroomsContext);

  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    // Get classrooms
    if (auth.tokens) {
      getAccessToken().then((accessToken) => {
        axios
          .get(
            process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE + "student/portfolio/",
            {
              headers: { Authorization: "Bearer " + accessToken },
            }
          )
          .then((res) => {
            setSubmissions(res.data);
          })
          .catch((res) => {
            console.log(res);
          });
      });
    }
  }, [auth.tokens]);

  return (
    <div>
      <Head>
        <title>Student | EchoClass</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/mini_logo.ico" />
      </Head>

      <main className="pt-8 px-8 bg-white">
        <h1 className="text-2xl font-semibold mb-4">Top Submissions</h1>
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="mb-4 bg-white rounded-md p-4 shadow"
          >
            <Link href={"/student/project/" + submission.id}>
              <div className="text-blue-500 font-semibold text-lg">
                {submission.task_name}
              </div>
            </Link>
            <p className="text-gray-500">Course: {submission.classroom_name}</p>
          </div>
        ))}
      </main>

      <footer></footer>
    </div>
  );
};

export default StudentProfile;
