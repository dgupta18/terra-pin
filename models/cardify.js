function cardify(pin) {
    var stars = ""
    for (x in pin.avgRating) {
        stars += "<span class=&quot;fa fa - star checked&quot;></span>"
    }
    var reviews = ""
    for (x in pin.reviews) {
        var rev_stars = ""
        for (y in x.rating) {
            rev_stars += "<span class=&quot;fa fa - star checked&quot;></span>"
        }
        reviews += `<div class="left-right">
                                <p style="float:left;">${x.reviews}</p>
                                <div id="star-rating">` + rev_stars + `</div>
                            </div>
                            <div style="border-top: 1px solid #2E577C; padding-bottom:10px;"></div>`
    }
    var tags = ""
    for (x in pin.tags) {
        tags += `<a href=&quot;/Tags/${x}&quot; id=&quot;groupDisp&quot;>${x}</a>`
    }
    var new_card =
        `<article id="displayCard">
                    <div class="left-right">
                        <div id="pinName">${pin.name}</div>
                        <div id="star-rating">` + stars + `</div>
                    </div>
                    <div style="border-top: 1px solid #2E577C; padding-bottom:5px;"></div>
                    <div id="space"></div>
                    <div class="center-cropped"style="background-image: url(${pin.image});"></div>
                    <div id="space"></div>
                    <span class="pinInfo">Description: ${pin.description}</span></br>
                    <div id="space"></div>
                    <span class="pinInfo">Uploaded by: ${pin.user}</span>
                    <div id="space"></div>
                    <span class="pinInfo">Average rating: ${pin.avgRating} stars</span>
                    <div id="space"></div>
                    <div class="left-right">
                        <span class="pinInfo" style="float:left">Read the reviews: </span>
                        <a href="/createReview" style="float:right;">Add a Review</a>
                    </div>`
        + reviews + `
                    <div style="border-top: 1px solid #2E577C; padding-bottom:10px;"></div>`+ tags + `   
                </article>
                <br>`

    // clean up quotes
    new_card.replace(/"/g, '&quot;');

    return new_card;
}

module.exports = {
    cardify: cardify
}