<template>
    <div class="card h-100 shadow-sm border-0">
        <div class="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center pb-0">
            <span class="fw-bold">Interaction Summary</span>
            <select class="form-select form-select-sm" style="width: auto;">
                <option>Last 90 days</option>
            </select>
        </div>
        <div class="card-body">
            <!-- Skeleton Placeholder content -->
            <div class="row g-2 h-100">
                <div class="col-6">
                    <div class="p-3 border rounded bg-light h-100">
                        <div class="text-muted small">Total Account Calls</div>
                        <div class="fs-3 fw-bold">35</div>
                        <div class="text-muted" style="font-size: 0.75rem;">Avg. Attendees per call: 6</div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="p-3 border rounded bg-light h-100">
                        <div class="text-muted small">Total Calls w/ Media</div>
                        <div class="fs-3 fw-bold">21</div>
                        <div class="text-muted" style="font-size: 0.75rem;"># Media used: 8</div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="p-3 border rounded bg-light h-100">
                        <div class="text-muted small">Total Sent Emails</div>
                        <div class="fs-3 fw-bold">32</div>
                        <div class="text-muted" style="font-size: 0.75rem;">Email Clicked Rate: 60%</div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="p-3 border rounded bg-light h-100">
                        <div class="text-muted small">Pending Suggestions</div>
                        <div class="fs-3 fw-bold">10</div>
                        <div class="text-muted" style="font-size: 0.75rem;">Total Actioned: 20</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup></script>