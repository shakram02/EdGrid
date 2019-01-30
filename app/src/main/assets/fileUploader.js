var fileUploader = Vue.component('uploader', {
  template: `
      <div>
          <modal>
            <template slot="title">Add Questions</template>
            <template slot="content">
              <iframe src="fileUploader.html" height="220px" width="100%" style="border:none;"></iframe>
            </template>
          </modal>
      </div>
  `
})
/*
  File is being uploaded either by dragging, or by browsing,
  Then the text inside it is stored in localStorage to be used from else where.
*/
