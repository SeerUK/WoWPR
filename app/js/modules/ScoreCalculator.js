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
          var multiplier = 0.5;

          if (key == 'mainHand' && typeof items['offHand'] == 'undefined') {
            multiplier = 1;
          }

          score += Math.round((items[key].itemLevel * multiplier) * items[key].quality);
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
     * Get raid score
     *
     * @param  object character
     * @return integer
     */
    getRaidScore: function(progression) {
      var raids = progression.raids;
      var score = 0;

      for (var key in raids) {
        score += raids[key].normal * 100;
        score += raids[key].heroic * 100;
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
      var total  = 0;
      var scores = {
        achievements: this.getAchievementScore(character),
        gear:         this.getGearScore(character.items),
        professions:  this.getProfessionsScore(character.professions),
        raids:        this.getRaidScore(character.progression),
      };

      for (var key in scores) {
        total += scores[key];
      }

      // Must be calculated after total
      for (var key in scores) {
        scores[key] = {
          score: scores[key],
          percentage: Math.round(((scores[key] / total) * 100)),
        }
      }

      scores.total = total;

      return scores;
    }
  }
};
