<template>
    <div class="card h-100 shadow-sm border-0">
        <div class="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center pb-0">
            <span class="fw-bold">Action Items (4)</span>
            <span class="badge bg-danger rounded-pill"><i class="bi bi-bell-fill me-1"></i>Due in 30 days</span>
        </div>
        <div class="card-body p-0 mt-2 overflow-auto" style="max-height: 250px;">
            <!-- Skeleton Placeholder content -->
            <table class="table table-sm table-hover mb-0" style="font-size: 0.85rem;">
                <thead class="table-light text-muted">
                    <tr>
                        <th class="fw-normal">ACTION ITEM</th>
                        <th class="fw-normal">ACCOUNT</th>
                        <th class="fw-normal">ASSIGNEE</th>
                        <th class="fw-normal">DUE DATE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="text-primary text-wrap" style="width: 40%;">Lorem ipsum dolor sit amet, consectetur adipiscing elit</td>
                        <td class="text-primary">Arielle Duplessy</td>
                        <td>Bob Harper</td>
                        <td>03/15/2026</td>
                    </tr>
                    <tr>
                        <td class="text-primary text-wrap">Lorem ipsum dolor sit amet, consectetur adipiscing elit</td>
                        <td class="text-primary">Michelle Martin</td>
                        <td>Bob Harper</td>
                        <td>03/23/2026</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup></script>