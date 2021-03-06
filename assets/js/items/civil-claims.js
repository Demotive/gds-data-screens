var civilClaims = {

  url: '/civil-claims',

  total: 0,
  digitalTotal: 0,
  nonDigitalTotal: 0,
  dateFrom: [],

  loadData: function() {
    loadUrl = civilClaims.url;
    if (typeof offline !== 'undefined') {
      civilClaims.parseData(civil_claims_json);
      return;
    }
    $.ajax({
      dataType: 'json',
      cache: false,
      url: loadUrl,
      success: function(d) {
        civilClaims.parseData(d);
      }
    });
  },

  parseData: function(d) {
    // get the oldest date WITH data (it didn't launch that long ago)
    var lump = d.data[0].values;

    for (var i = 0; i < lump.length; i++) {
      if (lump[i]['count:sum'] > 0) {
        this.dateFrom = lump[i]._start_at.split('-');
        break;
      }
    }
    
    this.digitalTotal = d.data[0]['count:sum'];
    this.nonDigitalTotal = d.data[1]['count:sum'];

    this.total = this.digitalTotal + this.nonDigitalTotal;

    civilClaims.updateDisplay();
  },

  updateDisplay: function() {
    var $el = $('.civil-claims');
    $el.find('.total-figure').text(addCommas(this.total));
    $el.find('.total-digital').text(addCommas(this.digitalTotal));
    $el.find('.total-non-digital').text(addCommas(this.nonDigitalTotal));
    $el.find('.latest-date').text(monthsMap[this.dateFrom[1]] + ' ' + this.dateFrom[0]);
  }

};

$(function() {
  civilClaims.loadData();
});