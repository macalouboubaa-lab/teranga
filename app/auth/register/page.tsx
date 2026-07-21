/*Différences avec Login
Spécifique
Même que Login :
✅
Les 3 imports du haut
✅
Le style des inputs et boutons
✅
Le loading state
Spécifique à Register :
➕
Champ full_name — nom du client/chauffeur
➕
Champ phone — téléphone (pour Wave/OM)
➕
Sélecteur de rôle — bouton Client ou Chauffeur
➕
signUp() au lieu de signInWithPassword()
➕
Insert dans la table users après création du compte*/


// 1. Créer le compte
Auth const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { role, full_name } } }) 
// 2. Insérer dans ta table users
if (!error && data.user) { await supabase.from("users").insert({ id: data.user.id, email, phone, full_name, role }) router.push(role === "driver" ? "/driver/home" : "/client/home") }
