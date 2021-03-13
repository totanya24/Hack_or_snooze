"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
    storyList = await StoryList.getStories();
    $storiesLoadingMsg.remove();

    putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
    // console.debug("generateStoryMarkup", story);

    const hostName = story.getHostName();

    const showStar = Boolean(currentUser);
    return $(`
      <li id="${story.storyId}">
        ${showDeleteBtn ? getDeleteBtnHTML() : ""}
        ${showStar ? getStarHTML(story, currentUser) : "" }
       
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function getDeleteBtnHTML(){
    return `<span class="trash-can">
        <i class="fas fa-trash"></i>
      </span>`

}

/** Gets list of stories from server, generates their HTML, and puts on page. */
function getStarHTML(story, user){
    const isFavorite = user.isFavorite(story);
    const starType = isFavorite ? "fas" : "far";
    return  ` <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}


function putStoriesOnPage() {
    console.debug("putStoriesOnPage");

    $allStoriesList.empty();

    // loop through all of our stories and generate HTML for them
    for (let story of storyList.stories) {
        const $story = generateStoryMarkup(story);
        $allStoriesList.append($story);
    }

    $allStoriesList.show();
}

async function deleteStory(evt){
    console.log("deleteStory");

    const $closestLi = $(evt.target).closest("li");
    const storyId = $closestLi.attr("id");
    await storyList.removeStory(currentUser, storyId);

    await putUserStoriesOnPage();
}

$ownStories.on("click", ".trash-can", deleteStory);

async function submitNewStory(evt){
    console.debug("submitNewStory");
    evt.preventDefault();


    const title = $("#create-title").val();
    const url = $("#create-url").val();
    const author = $("#create-author").val();
    const username = currentUser.username
    const storyData = {title, url, author, username};

    for ( let story of currentUser.ownStories) {
        console.log('story.innerval', story.title)
        console.log('input.value', title)

        //const oldStory = story;
        if (story.title.toLowerCase() === title.toLowerCase()) {
            alert("duplicate message");
            return
        }
    }

    const story = await storyList.addStory(currentUser, storyData);

    const $story = generateStoryMarkup(story);
    $allStoriesList.prepend($story);



    $submitForm.slideUp("slow");
    $submitForm.trigger("reset");
}

$submitForm.on("submit", submitNewStory);


function putUserStoriesOnPage(){
    console.log("putUserStoriesOnPage");

    $ownStories.empty();

    if(currentUser.ownStories.length === 0){
        $ownStories.append("<h5>No stories added by user yet! </h5>");
    } else{
        // loop through all of users stories and generate HTML for them
        for(let story of currentUser.ownStories){
            let $story = generateStoryMarkup(story, true);
            $ownStories.append($story);

            // console.log('c',currentUser.ownStories.innerText)
        }
    }
    //console.log('before show:', $ownStories)
    $ownStories.show();
}

function putFavoritesListOnPage(){
    $favoritedStories.empty();

    if(currentUser.favorites.length === 0){
        $favoritedStories.append("<h5>No favorites are added </h5>");
    }else {
        for (let story of currentUser.favorites){
            let $story = generateStoryMarkup(story);
            $favoritedStories.append($story);
            console.log($favoritedStories);
        }
    }
    $favoritedStories.show();
}

async function toggleStoryFavorites(evt){
    console.debug("toggleStoryFavorite");

    const $tgt = $(evt.target);
    const $closestLi = $tgt.closest("li");
    const storyId = $closestLi.attr("id");
    const story = storyList.stories.find(s => s.storyId === storyId);

    if ($tgt.hasClass("fas")){
        await currentUser.removeFavorite(story);
        $tgt.closest("i").toggleClass("fas far");
    } else {
        await currentUser.addFavorite(story);
        $tgt.closest("i").toggleClass("fas far");
    }
}
$storieslist.on("click", ".star", toggleStoryFavorites);