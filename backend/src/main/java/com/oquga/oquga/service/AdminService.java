package com.oquga.oquga.service;

import com.oquga.oquga.dto.admin.res.UniversityAdminListResponse;

public interface AdminService {

    UniversityAdminListResponse getUniversityAdmins(String search, int page, int limit);
}
