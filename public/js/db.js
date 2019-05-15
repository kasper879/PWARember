


 db.enablePersistence()
 .catch(function(err) {
   if (err.code == 'failed-precondition') {
     // probably multible tabs open at once
     console.log('persistance failed');
   } else if (err.code == 'unimplemented') {
     // lack of browser support for the feature
     console.log('persistance not available');
   }
 });


db.collection("recipe").get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        console.log(doc.data());
    })
});

db.collection('recipe').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        console.log("change", change);
      if(change.type === 'added'){
          console.log("add")
        renderRecipe(change.doc.data(), change.doc.id);
      }
      if(change.type === 'removed'){
        // remove the document data from the web page
        console.log("remove"); 
        removeRecipe(change.doc.id);
      }
    });
  });

const form = document.querySelector('form');
form.addEventListener('submit', evt => {
  evt.preventDefault();
  const recipe = {
    name: form.title.value,
    ingredients: form.stk.value
  };
console.log("recipe", recipe);
  db.collection('recipe').add(recipe)
    .catch(err => console.log(err));
    
  form.title.value = '';
  form.stk.value = '';
});


const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', evt => {
    console.log("kuku");
    if(evt.target.tagName === 'I'){
    const id = evt.target.getAttribute('data-id');
    console.log(id);
    db.collection('recipe').doc(id).delete();
  }
})
