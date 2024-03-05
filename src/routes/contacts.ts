import { Request, Response, Router } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { Contact } from '../types';

const router = Router();
const filePath = path.join(__dirname, '../', 'data', 'contacts.json');

router.get('/', (req: Request, res: Response) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Parse the JSON data
    const contacts: Contact[] = JSON.parse(data);

    // Send the contacts as a response
    res.json(contacts);
  });
});

router.put('/:id', (req: Request, res: Response) => {
  const idToUpdate: number = parseInt(req.params.id);
  const updatedContact: Contact = req.body;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const contacts: Contact[] = JSON.parse(data);

    // Find the index of the contact to update
    const contactIndex = contacts.findIndex(
      (contact) => contact.id === idToUpdate,
    );

    // If the contact is not found, return a 404 response
    if (contactIndex === -1) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    // Update the contact
    contacts[contactIndex] = { ...contacts[contactIndex], ...updatedContact };

    // Write the updated contacts back to the JSON file
    fs.writeFile(
      filePath,
      JSON.stringify(contacts, null, 2),
      'utf8',
      (writeErr) => {
        if (writeErr) {
          console.error('Error writing to JSON file:', writeErr);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        // Respond with the updated contact
        res.json(contacts[contactIndex]);
      },
    );
  });
});

router.post('/', (req: Request, res: Response) => {
  const newContact: Contact = req.body;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const contacts: Contact[] = JSON.parse(data);

    // Generate a new id for the contact
    const newId =
      contacts.length > 0
        ? Math.max(...contacts.map((contact) => contact.id)) + 1
        : 1;

    // Assign the new id to the contact
    newContact.id = newId;

    // Add the new contact to the contacts array
    contacts.push(newContact);

    // Write the updated contacts back to the JSON file
    fs.writeFile(
      filePath,
      JSON.stringify(contacts, null, 2),
      'utf8',
      (writeErr) => {
        if (writeErr) {
          console.error('Error writing to JSON file:', writeErr);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        // Respond with the newly added contact
        res.json(newContact);
      },
    );
  });
});

router.delete('/:id', (req: Request, res: Response) => {
  const idToDelete: number = parseInt(req.params.id);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const contacts: Contact[] = JSON.parse(data);

    // Find the index of the contact to delete
    const contactIndex = contacts.findIndex(
      (contact) => contact.id === idToDelete,
    );

    // If the contact is not found, return a 404 response
    if (contactIndex === -1) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    // Remove the contact from the array
    const deletedContact = contacts.splice(contactIndex, 1)[0];

    // Write the updated contacts back to the JSON file
    fs.writeFile(
      filePath,
      JSON.stringify(contacts, null, 2),
      'utf8',
      (writeErr) => {
        if (writeErr) {
          console.error('Error writing to JSON file:', writeErr);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        // Respond with the deleted contact
        res.json(deletedContact);
      },
    );
  });
});

export default router;
