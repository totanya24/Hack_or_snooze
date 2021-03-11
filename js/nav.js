"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
    console.debug("navAllStories", evt);
    hidePageComponents();
    putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */
function navSubmitStoryClick(evt){
    console.debug("navSubmitStoryClick", evt);
    hidePageComponents();
    $allStoriesList.show();
    $submitForm.show();
}
$navSubmitStory.on("click", navSubmitStoryClick);

function navFavoritesClick(evt){
    console.debug("navFavoritesClick", evt);
    hidePageComponents();
    putFavoritesListOnPage()

}

$body.on("click", "#nav-my-stories", navFavoritesClick );

function navMyStories(evt){
    console.debug("navMyStories", evt);
    hidePageComponents();
    putUserStoriesOnPage();
    $ownStories.show();
}

$body.on("click", "#nav-my-stories", navMyStories);

function navLoginClick(evt) {
    console.debug("navLoginClick", evt);
    hidePageComponents();
    $loginForm.show();
    $signupForm.show();
}

$navLogin.on("click", navLoginClick);
function navProfileClick(evt){
    console.log("navProfileClick", evt);
    hidePageComponents();
    $userProfile.show();
}
$navUserProfile.on("click", navProfileClick);
/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
    console.debug("updateNavOnLogin");
    $(".main-nav-links").show();
    $(".main-nav-links").show();
    $(".nav-left").show();
    $(".user-info-container").show();
    $navLogin.hide();
    $navLogOut.show();
    $navUserProfile.text(`${currentUser.username}`).show();
    $navUserProfile.html(`<i class="fas fa-user"></i> ${currentUser.username} - ${currentUser.name}`).show();

}
