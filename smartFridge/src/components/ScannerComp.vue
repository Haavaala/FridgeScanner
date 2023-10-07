<script setup>
import { StreamBarcodeReader } from "vue-barcode-reader";
import axios from "axios";
import { ref } from "vue"; // Import ref from Vue
</script>

<template>
  <div>
    <div>
      <!-- Button to open the scanner -->
      <button @click="openScanner" v-if="!scannerOpen">Open Scanner</button>
      <!-- Button to close the scanner -->
      <button @click="closeScanner" v-if="scannerOpen">Close Scanner</button>
    </div>
    <div v-if="scannerOpen">
      <StreamBarcodeReader
        @decode="onDecode"
        @loaded="onLoaded"
      ></StreamBarcodeReader>
    </div>
    <div>
      <h2>Scanned items:</h2>
      <div v-for="item in list" :key="item">
        <p>{{ item }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    // Define scannerOpen as a ref
    const scannerOpen = ref(false);

    // Export the variables to be used by the page
    return {
      list: [],
      fineList: [{}],
      scannerOpen, // Assign it to the component's data
    };
  },

  methods: {
    // Method to open the scanner
    openScanner() {
      this.scannerOpen = true;
    },

    // Method to close the scanner
    closeScanner() {
      this.scannerOpen = false;
    },

    updateList() {
      this.list = [];

      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "http://localhost:4005/api/item/",
      };

      axios
        .request(config)
        .then((response) => {
          response.data.forEach((data) => {
            this.list.push(data.name + " x" + data.amount);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // generateFineList() {
    //   let found;
    //   this.fineList = [{}];
    //   for (let i = 0; i < this.list.length; i++) {
    //     found = false;

    //     this.fineList.forEach((fine) => {
    //       if (this.list[i] == fine.og) {
    //         found = true;
    //         console.log("Fant deg dummen");
    //       }
    //     });

    //     if (!found) {
    //       this.fineList.push({
    //         new: this.list[i] + " x" + this.countOccurrences(this.list, this.list[i]),
    //         og: this.list[i]
    //       });
    //     }
    //   }
    //   console.log(this.fineList);
    // },

    // countOccurrences(arr, target) {
    //   return arr.reduce(function (acc, item) {
    //     return item === target ? acc + 1 : acc;
    //   }, 0);
    // },

    // Methods for the html elements
    onDecode(result) {
      // When camera has decoded a barcode, log the result and add to list.
      console.log("Camera result: " + result);
      let data = JSON.stringify({
        barcode: result,
      });
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:4005/api/item/",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          this.$toast.open({
            message: "Scanned item: " + response.data.name,
            type: "success",
            pauseOnHover: true,
            duration: 5000,
            position: "top-right",
          });
          this.updateList();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
