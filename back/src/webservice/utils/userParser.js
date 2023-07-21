// @flow

/* ::
  import type { User } from "../../types.flow"
*/

function userParser(content /* : any */) /* : User */ {
  return {
    id: content.Utilisateur.Id,
    firstName: content.Utilisateur["Prénom"],
    lastName: content.Utilisateur.Nom,
    email: content.Utilisateur.Email,
  };
}

module.exports = userParser;
