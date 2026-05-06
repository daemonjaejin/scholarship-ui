import api from "@/api/axios";

// Job 목록 조회
export const getJobList = () => {
  return api.get("/api/quartz/jobs");
};

// Job 등록
export const createJob = (jobData) => {
  return api.post("/api/quartz/jobs", jobData);
};

// Job 수정
export const updateJob = (jobData) => {
  return api.put("/api/quartz/jobs", jobData);
};

// Job 삭제
export const deleteJob = (jobGroup, jobName) => {
  return api.delete(`/api/quartz/jobs/${jobGroup}/${jobName}`);
};

// Job 즉시 실행
export const triggerJob = (jobGroup, jobName) => {
  return api.post(`/api/quartz/jobs/${jobGroup}/${jobName}/trigger`);
};

// 배치 로그 목록 조회
export const getBatchLogs = (jobName) => {
  return api.get(`/api/batch/logs/${jobName}`)
}

// 배치 로그 상세 조회
export const getBatchLogDetails = (jobName, batchLogId) => {
  return api.get(`/api/batch/logs/${jobName}/${batchLogId}/details`)
}
