<template>
    <div class="card shadow-sm border-0">
        <div class="card-header bg-white d-flex justify-content-between align-items-center border-bottom pb-2 pt-3">
            <span class="fw-bold fs-5"><i class="bi bi-lightning-charge me-2"></i>Engagement Plans (10)</span>
            <div class="d-flex">
                <select class="form-select form-select-sm me-2" style="width: auto;">
                    <option>Facility Level</option>
                </select>
                <div class="input-group input-group-sm" style="width: 200px;">
                    <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control border-start-0 ps-0" placeholder="Search...">
                </div>
            </div>
        </div>
        <div class="card-body p-0 table-responsive">
            <!-- Skeleton Placeholder content -->
            <table class="table table-hover align-middle mb-0" style="font-size: 0.9rem;">
                <thead class="table-light text-muted small">
                    <tr>
                        <th class="fw-normal py-2 ps-3">ENGAGEMENT PLAN</th>
                        <th class="fw-normal">ACCOUNT</th>
                        <th class="fw-normal"># OBJECTIVES</th>
                        <th class="fw-normal"># ACTION ITEMS</th>
                        <th class="fw-normal">PROGRESS</th>
                        <th class="fw-normal text-center">NO ACTIVITIES<br><span style="font-size:0.7rem">(last 30 days)</span></th>
                        <th class="fw-normal text-center">ACHIEVEMENTS<br><span style="font-size:0.7rem">(completed in 15 days)</span></th>
                        <th class="fw-normal text-center">LINK PROFILE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="text-primary ps-3">Amity Hospital Global Plan - 2026</td>
                        <td class="text-primary">Amity Hospital Center</td>
                        <td>4</td>
                        <td>10</td>
                        <td>
                            <div class="d-flex align-items-center">
                                <div class="progress me-2 flex-grow-1" style="height: 8px;">
                                    <div class="progress-bar bg-primary" role="progressbar" style="width: 70%;"></div>
                                </div>
                                <span class="fw-bold me-1">70%</span> <span class="text-muted small">(7/10)</span>
                            </div>
                        </td>
                        <td class="text-center"></td>
                        <td class="text-center"><span class="badge bg-success rounded-circle p-2">2</span></td>
                        <td class="text-center"><a href="#" class="text-decoration-none">View</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup></script>