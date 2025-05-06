import axios from 'axios';

export const signIn = async (user) => {
  // include cookies (or authentication tokens) in cross-origin requests
  return axios.post(`${process.env.REACT_APP_BASE_URL}/users/login`, user, {
    withCredentials: true
  });
};

export const signOut = async () => {
  return axios.post(`${process.env.REACT_APP_BASE_URL}/users/logout`, {}, {
    headers: {
      'ngrok-skip-browser-warning': '69420',
      'Content-Type': 'application/json'
    },
    withCredentials: true // Ensures cookies (like HttpOnly tokens) are sent
  });
};

export const generate = async (link, token) => {
  return axios.post(`${process.env.REACT_APP_BASE_URL}/api/candidates/generate-link`, link, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const subject = async (token) => {
  return axios.get(`${process.env.REACT_APP_BASE_URL}/api/questions/getAllSubject`, {
    headers: {
      "ngrok-skip-browser-warning": "69420",
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      const subjects = response.data.data.map(subject => ({
        _id: subject._id,
        subject_name: subject.subject_name
      }));
      return subjects;
    })
    .catch(error => {
      console.error('Error fetching subjects:', error);
      throw error;
    });
};

export const upload = async (file, subject, token) => {
  return axios.post(`${process.env.REACT_APP_BASE_URL}/api/questions/bulk-upload?subject=${subject}`, file, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'multipart/form-data',
    }
  });
};

export const addSubject = async (subjectData, token) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/questions/addSubject`, { subject: subjectData }, {
      headers: {
        "ngrok-skip-browser-warning": "69420",
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const subjectDetails = async (token, query = {}) => {
  return axios.get(`${process.env.REACT_APP_BASE_URL}/api/results/subjects`, {
    headers: {
      "ngrok-skip-browser-warning": "69420",
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    params: query
  });
};

export const LinkingsubjectDetails = async (token, query = {}) => {
  return axios.get(`${process.env.REACT_APP_BASE_URL}/api/results/subjects/link-tracking`, {
    headers: {
      "ngrok-skip-browser-warning": "69420",
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    params: query
  });
};

export const candidatesResult = async (token, subjectId, query = {}) => {
  return axios.get(`${process.env.REACT_APP_BASE_URL}/api/results/candidates/${subjectId}`, {
    headers: {
      "ngrok-skip-browser-warning": "69420",
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    params: query
  });
};

export const linkTrackedDetails = async (token, subjectId, query = {}) => {
  return axios.get(`${process.env.REACT_APP_BASE_URL}/api/dashboard/link-tracking/${subjectId}`, {
    headers: {
      "ngrok-skip-browser-warning": "69420",
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    params: query
  });
};

// export const candidatesResult = async (token, subjectId, query = {}) => {
//   try {
//     const response = await axios.get(`${REACT_APP_BASE_URL}/api/results/candidates/${subjectId}`, {
//       headers: {
//         "ngrok-skip-browser-warning": "69420",
//         'Content-type': 'application/json',
//         Authorization: `Bearer ${token}`
//       },
//       params: query
//     });
//     return {
//       data: response.data.data,
//       total: response.data.total,
//     };
//   } catch (error) {
//     throw error;
//   }
// };


export const sendMail = async (emailData, token) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/candidates/send-email`, emailData, {
      headers: {
        "ngrok-skip-browser-warning": "69420",
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};


export const subjectTests = async (token) => {
  return axios.get(`${process.env.REACT_APP_BASE_URL}/api/dashboard/subject-tests`, {
    headers: {
      "ngrok-skip-browser-warning": "69420",
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
};

export const testCandidatesCount = async (token) => {
  return axios.get(`${process.env.REACT_APP_BASE_URL}/api/dashboard/test-candidates-count`, {
    headers: {
      "ngrok-skip-browser-warning": "69420",
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
};

export const subjectTestMonthly = async (token, query = {}) => {
  return axios.get(`${process.env.REACT_APP_BASE_URL}/api/dashboard/subject-tests-monthly`, {
    headers: {
      "ngrok-skip-browser-warning": "69420",
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    params: query
  });
};


