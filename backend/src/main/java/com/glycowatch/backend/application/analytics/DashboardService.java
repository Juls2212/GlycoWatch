package com.glycowatch.backend.application.analytics;

import com.glycowatch.backend.interfaces.dto.analytics.DashboardResponseDto;

public interface DashboardService {

    DashboardResponseDto getDashboard(String authenticatedEmail);
}

