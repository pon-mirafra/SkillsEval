import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL; //"https://a4ce-202-83-17-88.ngrok-free.app";

export const signIn = async (user) => {
  return axios.post(`${BASE_URL}/api/admin/login`, user);
};

export const signOut = async (token) => {
  return axios.get(`${BASE_URL}/api/admin/logout`, {
    headers: {
      "ngrok-skip-browser-warning": "69420",
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
};

export const generate = async (link, token) => {
  return axios.post(`${BASE_URL}/api/candidates/generate-link`, link, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const subject = async (token) => {
  return axios.get(`${BASE_URL}/api/questions/getAllSubject`, {
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
  return axios.post(`${BASE_URL}/api/questions/bulk-upload?subject=${subject}`, file, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'multipart/form-data',
    }
  });
};

export const addSubject = async (subjectData, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/questions/addSubject`, { subject: subjectData }, {
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
  return axios.get(`${BASE_URL}/api/results/subjects`, {
    headers: {
      "ngrok-skip-browser-warning": "69420",
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    params: query
  });
};

export const LinkingsubjectDetails = async (token, query = {}) => {
  return axios.get(`${BASE_URL}/api/results/subjects/link-tracking`, {
    headers: {
      "ngrok-skip-browser-warning": "69420",
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    params: query
  });
};

export const candidatesResult = async (token, subjectId, query = {}) => {
  return axios.get(`${BASE_URL}/api/results/candidates/${subjectId}`, {
    headers: {
      "ngrok-skip-browser-warning": "69420",
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    params: query
  });
};

export const linkTrackedDetails = async (token, subjectId, query = {}) => {
  return axios.get(`${BASE_URL}/api/dashboard/link-tracking/${subjectId}`, {
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
//     const response = await axios.get(`${BASE_URL}/api/results/candidates/${subjectId}`, {
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
    const response = await axios.post(`${BASE_URL}/api/candidates/send-email`, emailData, {
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
  return axios.get(`${BASE_URL}/api/dashboard/subject-tests`, {
    headers: {
      "ngrok-skip-browser-warning": "69420",
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
};

export const testCandidatesCount = async (token) => {
  return axios.get(`${BASE_URL}/api/dashboard/test-candidates-count`, {
    headers: {
      "ngrok-skip-browser-warning": "69420",
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
};

export const subjectTestMonthly = async (token, query = {}) => {
  return axios.get(`${BASE_URL}/api/dashboard/subject-tests-monthly`, {
    headers: {
      "ngrok-skip-browser-warning": "69420",
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    params: query
  });
};


