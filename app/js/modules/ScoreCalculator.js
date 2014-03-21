var ScoreCalculator = function() {
  return {
    /**
     * Get achievement score from character
     * @return {[type]} [description]
     */
    getAchievementScore: function(character) {
      return Math.round(character.achievementPoints * 0.5);
    },

    /**
     * Get gear score from items
     *
     * @param  object items
     * @return integer
     */
    getGearScore: function(items) {
      var score = 0;

      for (var key in items) {
        if ( ! items.hasOwnProperty(key)) {
          continue;
        }

        if (typeof items[key] === 'object' && key != 'tabard') {
          score += Math.round((items[key].itemLevel * 0.5) * items[key].quality);
        }
      }

      return score;
    },

    /**
     * Get profession score from professions
     *
     * @param  object professions
     * @return integer
     */
    getProfessionsScore: function(professions) {
      var primary = professions.primary;
      var score   = 0;

      for (var key in primary) {
        score += primary[key].rank;
      }

      return score;
    },

    /**
     * Get all scores and total
     *
     * @param  object character
     * @return object
     */
    getScore: function(character) {
      console.log(character);

      var total  = 0;
      var scores = {
        achievement: this.getAchievementScore(character),
        gear:        this.getGearScore(character.items),
        professions: this.getProfessionsScore(character.professions),
      };

      for (var key in scores) {
        total += scores[key];
      }

      // (x / total) * 100 = percentage of total

      scores.total = total;

      console.log(scores);

      return scores;
    }
  }
};
