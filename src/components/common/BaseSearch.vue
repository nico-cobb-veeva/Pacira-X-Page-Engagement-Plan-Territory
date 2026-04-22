<template>
	<div class="search-box">
		<div
			class="d-flex align-items-center search-input-wrapper"
			:class="searchInputClasses"
		>
			<FontAwesomeIcon
				:icon="faSearch"
				size="sm"
				style="color: grey; padding-left: 0.5rem"
			/>
			<input
				v-if="!selectedOption"
				type="text"
				class="form-control search-input"
				:placeholder="placeholder"
				:value="searchTerm"
				v-model="searchTerm"
				@focus="handleFocus"
				@blur="handleBlur"
			/>
			<div v-else class="form-control">
				<span class="selected-option">{{ selectedOption.display }}</span>
			</div>
			<FontAwesomeIcon
				v-if="searchTerm || selectedOption"
				:icon="faXmarkCircle"
				size="sm"
				style="color: grey; cursor: pointer; padding-right: 0.5rem"
				@click="handleClear"
			/>
		</div>
	</div>
</template>

<script setup>
// @ is an alias to /src
import { defineProps, defineEmits, defineModel, ref, computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faSearch, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";

defineProps({
	placeholder: {
		type: String,
		default: "Search...",
	}
});

const searchTerm = defineModel("searchTerm");
const selectedOption = defineModel("selectedOption");

const emits = defineEmits(["focus", "blur", "clear"]);

const isFocused = ref(false);

const handleFocus = () => {
	isFocused.value = true;
	emits("focus");
};

const handleBlur = () => {
	setTimeout(() => {
		isFocused.value = false;
	}, 150);
	emits("blur", searchTerm);
};

const handleClear = () => {
  emits('update:searchTerm', '');
  emits('update:selectedOption', '');
}

const searchInputClasses = computed(() => ({
	"search-input-wrapper--focused": isFocused.value,
}));
</script>

<style scoped>
.search-box {
	min-width: 16.5rem;
}
input.form-control.search-input:focus {
	border: 0;
	box-shadow: none;
}
input.form-control.search-input {
	border: 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.search-input-wrapper {
	border: 1px solid rgb(211, 210, 210);
	border-radius: 0.25rem;
}
.search-input-wrapper--focused {
	border-color: #f8972b;
	box-shadow: 0 0 0 0.05rem #f8972b;
}
div.form-control {
	border: 0;
  height: 30px;
	display: flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  padding: 0;
  flex: 1;
  cursor: default;
}
.selected-option {
	background-color: rgb(214, 235, 206);
	border: 1px solid rgb(228, 228, 228);
	border-radius: 0.25rem;
	padding: 0.2rem 0.5rem;
	margin-left: 0.5rem;
	margin-right: 0.5rem;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 100%;
	line-height: 1.5;
}
</style>
