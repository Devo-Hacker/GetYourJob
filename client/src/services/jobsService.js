import apiClient from "../api/client";

// role is required to be dynamic - omitting it means the backend falls
// back to the user's saved Profile.targetRole, but Jobs.jsx always
// passes the live value from TargetRoleContext so results update the
// moment the user changes their target role.
export async function getJobs(role, location) {
  const { data } = await apiClient.get("/jobs", {
    params: { role, location: location || undefined },
  });
  return data.jobs;
}

export async function getJobStats() {
  const { data } = await apiClient.get("/jobs/stats");
  return data;
}

export async function saveJob(job) {
  const { data } = await apiClient.post(`/jobs/${job.id}/save`, {
    snapshot: {
      title: job.title,
      company: job.company,
      location: job.location,
      redirectUrl: job.redirectUrl,
      salary: job.salary,
      match: job.match,
    },
  });
  return data;
}

export async function applyJob(job) {
  const { data } = await apiClient.post(`/jobs/${job.id}/apply`, {
    snapshot: {
      title: job.title,
      company: job.company,
      location: job.location,
      redirectUrl: job.redirectUrl,
      salary: job.salary,
      match: job.match,
    },
  });
  return data;
}
