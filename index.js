import express from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';


const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(express.json());


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error : 'champs obligatoire manquants'
    });
  }

  try { 
    const user = await prisma.user.findUnique({
      where: {
        email
      }
  });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
  if(!await bcrypt.compare(password, user.password)){
    return res.status(401).json({ error: 'Mot de passe incorrect' });
  }

  const { password: userPassword, ...userData } = user;
  res.status(200).json({ message: 'Connexion réussie', user: userData });
  }
  catch(error){
    console.error(error);
    res.status(500).json({ error: 'Erreur du serveur' });
  }
});


app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'Champs obligatoires manquants',
      missingFields: {
        name: !name ? 'Nom est requis' : undefined,
        email: !email ? 'Un Email est requis' : undefined,
        password: !password ? 'Un mots de passe est requis' : undefined
      }
    });
  }

  try {
    const hasedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hasedPassword
      }
    });


    res.status(201).json({ message: 'Utilisateur enregistrer avec succes', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur du serveur' });
  }
});
app.get('/user', async (req, res) => {
  const {id} = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID invalide' });
  }

  try{
    const user = await prisma.user.findUnique({
      where: {
        id: String(id)
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: false,
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur du serveur' });
  }
});


app.delete('/user', async (req, res) => {
  const {id} = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID invalide' });
  }

  try {
    const user = await prisma.user.delete({
      where: {
        id: String(id)
      }
    });

    res.status(200).json({ message: 'Utilisateur supprimé avec succès', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur du serveur' });
  }
});



app.listen(port, () => {
  console.log(`Exemple d'application sur le port${port}`);
});
