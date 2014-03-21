var CharacterDataHelper = function() {
  return {
    /**
     * Get active title from array of titles
     *
     * @param  array  titles
     * @return string
     */
    getActiveTitleFromTitles: function(titles) {
      for (i = 0; i < titles.length; i++) {
        if (typeof titles[i].selected !== "undefined" && titles[i].selected == true) {
          return titles[i].name
            .replace('%s', '')
            .replace(/^[, ]|[, ]$/g, '');
        }
      }
    },

    /**
     * Get class name by id
     *
     * @param  integer id
     * @return string
     */
    getClassNameById: function(id) {
      switch (id) {
        case 1:
          return 'Warrior';
        case 2:
          return 'Paladin';
        case 3:
          return 'Hunter';
        case 4:
          return 'Rogue';
        case 5:
          return 'Priest';
        case 6:
          return 'Death Knight';
        case 7:
          return 'Shaman';
        case 8:
          return 'Mage';
        case 9:
          return 'Warlock';
        case 10:
          return 'Monk';
        case 11:
          return 'Druid';
        default:
          return 'Not implemented';
      }
    },

    /**
     * Get faction name by race id
     *
     * @param  integer id
     * @return string
     */
    getFactionByRaceId: function(id) {
      switch (id) {
        case 1:  // Human
        case 3:  // Dwarf
        case 4:  // Night Elf
        case 7:  // Gnome
        case 11: // Draenei
        case 22: // Worgen
        case 25: // Alliance Pandaren
          return 'alliance';
        case 2:  // Orc
        case 5:  // Undead
        case 6:  // Tauren
        case 8:  // Troll
        case 9:  // Goblin
        case 10: // Blood Elf
        case 26: // Horde Pandaren
          return 'horde';
        default:
          return 'Not implemented';
      }
    },

    /**
     * Get race by id
     *
     * @param  integer id
     * @return string
     */
    getRaceById: function(id) {
      switch (id) {
        case 1:
          return 'human';
        case 2:
          return 'orc';
        case 3:
          return 'dwarf';
        case 4:
         return 'night elf';
        case 5:
          return 'undead';
        case 6:
          return 'tauren';
        case 7:
          return 'gnome';
        case 8:
          return 'troll';
        case 9:
          return 'goblin';
        case 10:
          return 'blood elf';
        case 11:
          return 'draenei';
        case 22:
          return 'worgen';
        case 25:
        case 26:
          return 'pandaren';
        default:
          return 'Not implemented';
      }
    }
  }
};
