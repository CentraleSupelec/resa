# Tests d'acceptance manuels

## Mail de confirmation

Scénario :
- Faire une réservation sur le créneau T avec un titre
- Vérifier que le mail envoyé décrit les bonnes informations (titre, T)

## Disponibilité

Scénario :
- Réserver la salle X sur le créneau T
- Commencer un nouvelle réservation et vérifier que X n'est plus dispo sur le créneau T ou un créneau Tbis qui recouvre T
- Annuler la réservation dans "Mes réservations"
- Vérifier que X est de nouveau disponible sur T

## Recherche par caractéristique

Scénario :
- Commencer la réservation sur le créneau T
- Entrer un texte de recherche, sélectionner différents types de salle (TP numériques, Espaces projets...), faire varier le nombre de personnes ou cocher la visioconférence.
- Vérifier que la liste des salles disponibles se met à jour

## Réservation avec visioconférence

Scénario :
- Réserver une salle X avec la visioconférence
- Vérifier qu'une fois la réservation effectuée un message indiquant que les infos de connexion à la visio seront envoyées par mail, et les vérifier dans le mail

## Réservation avec validation

Scénario 1 :
- Faire une réservation avec un compte U1 non manager de salle
- Vérifier que la réservation est en attente (pas de mail reçu, pas dans "Mes réservations")
- U2 manager de la salle valide la réservation
- Vérifier que la réservation est acceptée (mail + "Mes réservations")

Scénario 2 :
- Faire une réservation avec un compte U1 non manager de salle
- Vérifier que la réservation est en attente (pas de mail reçu, pas dans "Mes réservations")
- U2 manager de la salle refuse la réservation
- Vérifier que la réservation est refusée (mail + rien dans "Mes réservations")

Scénario 3 :
- Faire une réservation avec un compte manager de salle
- Vérifier que la réservation est acceptée automatiquement
