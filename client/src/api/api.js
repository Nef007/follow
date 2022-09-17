import axios from "axios";

const request = async (
  url,
  method = "GET",
  body = null,
  headers = {},
  files = false,
  getFileName = false
) => {
  if (body && !files) {
    body = JSON.stringify(body);
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method,
    body,
    headers,
    credentials: "include",
  });

  if (getFileName) {
    if (response.status === 200) {
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = getFileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Что то пошло не так");
      }

      return data;
    }
  } else {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Что то пошло не так");
    }

    return data;
  }
};

export const authAPI = {
  login(form) {
    return request("/api/user/login", "POST", form);
  },

  auth(token) {
    return request("/api/user/me", "GET", null, {
      Authorization: `Bearer ${token}`,
    });
  },

  async register(form) {
    // return request(`/api/user/register`, "POST", form, {}, true);
    return await axios.post("/api/user/register", form, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export const userAPI = {
  all(params, token) {
    return request("/api/users", "POST", params, {
      Authorization: `Bearer ${token}`,
    });
  },

  changePhoto(form, token) {
    return request(
      `/api/photo`,
      "PUT",
      form,
      {
        Authorization: `Bearer ${token}`,
      },
      true
    );
  },
  change(form, token) {
    return request(`/api/user`, "PUT", form, {
      Authorization: `Bearer ${token}`,
    });
  },
};

export const linkAPI = {
  create(link, type, token) {
    return request(
      `/api/link/${type}`,
      "POST",
      { link },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  },
  activated(id, token) {
    return request(`/api/link/${id}`, "PUT", null, {
      Authorization: `Bearer ${token}`,
    });
  },
  block(id, token) {
    return request(`/api/link/${id}`, "PATCH", null, {
      Authorization: `Bearer ${token}`,
    });
  },
  reset(id, token) {
    return request(`/api/link/reset/${id}`, "PUT", null, {
      Authorization: `Bearer ${token}`,
    });
  },
  follow(linkIdUser, linkIdMy, token) {
    return request(
      `/api/link/follow/${linkIdUser}`,
      "POST",
      { linkIdMy },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  },
  followers(linkIdMy, params, token) {
    return request(`/api/followers/${linkIdMy}`, "POST", params, {
      Authorization: `Bearer ${token}`,
    });
  },

  petition(linkIdUser, comment, token) {
    return request(
      `/api/link/petition/${linkIdUser}`,
      "POST",
      { comment },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  },

  get(linkId, token) {
    return request(`/api/link/${linkId}`, "GET", null, {
      Authorization: `Bearer ${token}`,
    });
  },
  getAll(type, token) {
    return request(`/api/links/${type}`, "GET", null, {
      Authorization: `Bearer ${token}`,
    });
  },
};

export const payAPI = {
  pay(values, token) {
    return request("/api/pay", "POST", values, {
      Authorization: `Bearer ${token}`,
    });
  },
  getBill(params, token) {
    return request("/api/pays", "POST", params, {
      Authorization: `Bearer ${token}`,
    });
  },

  cancelBill(id, token) {
    return request(`/api/pay/${id}`, "PUT", null, {
      Authorization: `Bearer ${token}`,
    });
  },
};
export const referalAPI = {
  get(params, token) {
    return request("/api/referals", "POST", params, {
      Authorization: `Bearer ${token}`,
    });
  },
};
