# roam2omnifocus

I prefer to keep my projects in OmniFocus, but for particularly fluid projects I like to use [interstitial journaling](https://medium.com/better-humans/replace-your-to-do-list-with-interstitial-journaling-to-increase-productivity-4e43109d15ef), which involves generating Roam TODOs that are then not in OmniFocus. This is my first stage attempt at implementing a way to keep these in sync.

Currently I have implemented a few basic datalog queries such that you can set up a query using AND or NOT and the script will copy all the associated TODOs found in that query to the clipboard, then open the OmniFocus inbox for you to paste it in (from what I can tell there is no good way to do this automatically right now as both Roam and OmniFocus only run js on their local apps). I haven't implemented query OR yet but this is certainly possible. 

For usability, you can [minify](https://javascript-minifier.com/) the resulting javascript and create a [Roam42 SmartBlock](https://roamresearch.com/#/app/roamhacker/page/GH0401tnt) with a [button](https://roamresearch.com/#/app/roamhacker/page/-y5HVWAXw) to click to execute, as shown in [this video](https://www.loom.com/share/5e0ebb30557245cc82cb5a0133e1c64d). Execution is pretty slow right now as it is running the query on the database and I have not implemented that optimally. 

## Possible Improvements

* Input variables, rather than a hard coded query (e.g. through SmartBlock button)
* Parse query string (rather than manually set up js)
* Execution speed
* Logical OR
* Ability to assign a project, tag, and/or note to each task
* Two-way sync (or at least a way to mark todos as transferred)
