<template>
	<div class="dropdown-wrapper" ref="dropdown">
		<BaseSearch
			@focus="showDropdown = true"
			@blur="handleBlur"
			v-model:searchTerm="searchTerm"
			v-model:selectedOption="selectedOption"
		/>
		<ul
			v-if="showDropdown"
			class="list-group dropdown-list"
			:style="dropdownListStyle"
		>
			<span v-if="options?.length">
				<li
					v-for="(option, index) in options"
					:key="`${option.value}-${index}`"
					class="list-group-item d-flex flex-row gap-2 align-items-center"
					@click="handleOptionClick(option)"
				>
					<FontAwesomeIcon
						:icon="option.icon ? option.icon : icon"
						:color="option.iconColor ? option.iconColor : iconColor"
						:size="iconSize"
					/>
					<div class="d-flex flex-column">
						<span class="main-value">{{ option.display }}</span>
						<span
							v-for="identifierKey of Object.keys(
								option.identifiers
							)"
							:key="identifierKey"
							class="identifier-value"
						>
							{{ option.identifiers[identifierKey] }}
						</span>
					</div>
				</li>
			</span>
			<span v-else>
				<li
					class="list-group-item d-flex flex-row gap-2 align-items-center"
				>
					<span class="no-records-value">{{ noRecordsDisplay }}</span>
				</li>
			</span>
		</ul>
	</div>
</template>

<script setup>
// @ is an alias to /src
import { ref, defineProps, computed, defineModel } from "vue";
import BaseSearch from "./BaseSearch.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const searchTerm = defineModel("searchTerm");
const selectedOption = defineModel("selectedOption");

const showDropdown = ref(false);

const props = defineProps({
	placeholder: {
		type: String,
		default: "Search...",
	},
	icon: {
		default: null,
	},
	iconColor: {
		default: "#B0B0B7",
	},
	iconSize: {
		default: "2xl",
	},
	options: {
		type: Array,
		default: () => [],
	},
	searchIdentifierKeys: {
		type: Array,
		default: () => [],
	},
	noRecordsDisplay: {
		type: String,
		default: "No records found",
	},
	dropdownMaxHeight: {
		type: String,
		default: "300px",
	},
});

const handleBlur = () => {
	setTimeout(() => {
		showDropdown.value = false;
	}, 150);
};

function handleOptionClick(option) {
	selectedOption.value = option;
}

const dropdownListStyle = computed(() => ({
	"max-height": props.dropdownMaxHeight,
}));
</script>

<style scoped>
.dropdown-wrapper {
	position: relative;
}

.dropdown-list {
	position: absolute;
	top: 102%;
	left: 0;
	width: 100%;
	z-index: 10;
	background: white;
	border-top: none;
	border-bottom: 1px solid #ccc;
	overflow-y: auto;
	font-size: 0.75rem;
}

.list-group-item {
	cursor: pointer;
	padding: 7px;
}

.list-group-item:hover {
	background-color: rgba(254, 172, 49, 0.1);
}

.main-value {
	font-size: 0.8rem;
}

.identifier-value {
	font-size: 0.75rem;
	color: rgb(138, 138, 138);
}

.no-records-value {
	font-size: 0.8rem;
	font-style: italic;
	color: rgb(138, 138, 138);
}
</style>
