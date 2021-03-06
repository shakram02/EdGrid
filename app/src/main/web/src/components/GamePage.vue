<template>
  <div>
    <b-container v-if="questions.length">
      <GameHeader ref="gameHeader"></GameHeader>
      </br>
      </br>
      </br>
      <b-container v-bind:class="['shape-container-' + theme]">
        <QuestionBody ref="questionBody">{{questionText}}</QuestionBody>
        <AnswersGrid v-bind:PossibleAnswers="PossibleAnswers" ref="AnswersGrid" />
        </br>
        <div class="next-ques" v-bind:class="['shape-' + theme]">
          <b-btn variant="outline-secondary" @click="nextQuestion">{{ $t('NextQuestion') }}</b-btn>
        </div>
        </br>
      </b-container>
    </b-container>
    <b-modal ref="helperModal">
      <div slot="modal-header"></div>
      <p v-if="failed">{{ $t('NoQuestionsYet') }}</p>
      <p v-else>{{ $t('CongratsYouFinished') }}</p>
      <div slot="modal-footer">
        <b-btn variant="outline-secondary" @click="returnToHome">{{ $t('Back') }}</b-btn>
      </div>
    </b-modal>
    <!-- Testing components -->
      <div id="test" v-if="testing">
        </br>
        <input type="text" v-model="testAnswer">

        <button type="button" @click="traceMovement(testAnswer)">Submit</button>
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import GameHeader from './GameComponents/GameHeader.vue'
import QuestionBody from './GameComponents/QuestionBody.vue'
import AnswersGrid from './GameComponents/AnswersGrid.vue'
import config from '../../configs.js'

export default {
  name: 'GamePage',
  components :{
    GameHeader,
    QuestionBody,
    AnswersGrid
  },
  data: function() {
    return{
      questions : [],
      questionIndex: 0,
      failed: true,
      testing: config.testing,
      testAnswer: ""
    }
  },
  computed: {
    questionText: function(){
      return this.questions[this.questionIndex].question;
    },
    correctAnswer: function(){
      return this.questions[this.questionIndex].correct;
    },
    PossibleAnswers: function(){
      return this.questions[this.questionIndex].choices;
    },
    ...mapGetters([
      'theme',
    ]),
  },
  methods: {
    nextQuestion: function(){
      if(this.questionIndex == this.questions.length -1){
        this.failed = false;
        this.$refs.gameHeader.stopTimer();
        this.$refs.helperModal.show();
      }
      else{
        this.questionIndex++;
        this.$refs.gameHeader.stopTimer();
        this.$refs.gameHeader.startTimeDown();
      }
    },
    returnToHome: function(){
      this.failed = true;
      this.$parent.playing = false;
    },
    checkAnswer: function(answer){
	  let ansIndex = this.PossibleAnswers.indexOf(this.correctAnswer);
	  console.log("Correct answer is:" + this.PossibleAnswers[ansIndex] + ", You selected:" + answer);
      if(this.PossibleAnswers.indexOf(answer) === ansIndex) this.celebrate();
      else this.getUpset();
    },
    celebrate: function(){
      this.$refs.questionBody.correctAnswer();
	     this.$refs.gameHeader.correctAnswer();
       setTimeout(this.nextQuestion, 1000);
    },
    getUpset: function(){
      this.$refs.questionBody.wrongAnswer();
  	  this.$refs.gameHeader.wrongAnswer();
      setTimeout(this.nextQuestion, 1000);
    },
    traceMovement: function(data){
      console.log("Recieved Data:" + data);
      this.$refs.AnswersGrid.changeLocation(data)
    }
  },
  mounted() {
    this.$options.sockets.onmessage = (data) => {
      if(isNaN(data.data)) console.log("Wrong Data type", typeof(data.data), data);
      else this.traceMovement(data.data);
    }
    let rawQuestions = this.$parent.questions;
    if(rawQuestions.length)  this.questions = rawQuestions;
    else  this.$refs.helperModal.show();
  }
}

</script>

<style scoped>
  .game-container {
    padding: 20px;
    background-color: #FFC000;
    border-top: 5px solid lightgrey;
    border-bottom: 5px solid grey;
    border-right: 5px solid grey;
    border-left: 5px solid lightgrey;
  }
  .next-ques {
    margin-left: auto;
    display: block;
    width: fit-content;
  }
</style>
