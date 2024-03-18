<template>
    <LoadingComponent v-if="isLoading" />
    <div class=" row justify-between q-pa-md">
        <div>

            <q-uploader label="Update and add data" class="q-my-sm q-mr-sm" accept=".xlsx,.xls"
                :factory="uploadExcelFile" />
        </div>
        <div>

            <q-uploader label="Update data" class="q-my-sm q-mr-sm" accept=".xlsx,.xls" :factory="updateExcelFile" />
        </div>

    </div>
</template>

<script setup>
import LoadingComponent from "src/components/LoadingComponent.vue";
import { useQuasar } from "quasar";
import { useStore } from "src/stores/store";
import ENV from "src/helpers/globals";
import { storeToRefs } from "pinia";
const store = useStore();
const { isLoading } = storeToRefs(store);
const { setIsLoading } = store;

const $q = useQuasar();
const uploadExcelFile = async (file) => {
    console.log('hi');
    try {
        setIsLoading(true);
        const formData = new FormData();

        formData.append('file', file[0]);

        const res = await fetch(`${ENV.HomeURL}/items/updateAll`, {
            method: 'post',

            body: formData
        })

        if (!res.ok) {
            let response = await res.text();
            $q.notify({
                color: "red-5",
                textColor: "white",
                icon: "warning",
                message: response,
            });
        } else {
            $q.notify({
                color: "red-5",
                textColor: "white",
                icon: "warning",
                message: 'success',
            });
            console.log(res.text());
        }
    } catch (err) {
        console.log("error: " + err);
    } finally {
        setIsLoading(false)
    }

}

const updateExcelFile = async (file) => {
    try {
        setIsLoading(true);
        const formData = new FormData();

        formData.append('file', file[0]);

        const res = await fetch(`${ENV.HomeURL}/items/updateAllData`, {
            method: 'post',

            body: formData
        })

        if (!res.ok) {
            let response = await res.text();
            $q.notify({
                color: "red-5",
                textColor: "white",
                icon: "warning",
                message: response,
            });
        } else {
            $q.notify({
                color: "red-5",
                textColor: "white",
                icon: "warning",
                message: 'success',
            });
            console.log(res.text());
        }
    } catch (err) {
        console.log("error: " + err);
    } finally {
        setIsLoading(false)
    }
}
</script>