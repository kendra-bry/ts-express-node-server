import { Request, Response, Router } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { Contact } from '../types';
import { fetchContactsById } from '../helpers/helpers';

const router = Router();
const filePath = path.join(__dirname, '../', 'data', 'contacts.json');

// POST endpoint to add a new contact
router.post('/', (req: Request, res: Response) => {
  const newContact: Contact = req.body;

  fs.readFile(filePath, 'utf8', (err, data) => {
    // Handle any errors reading the file
    if (err) {
      console.error(err);
      throw new Error('Error reading JSON file');
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
        // Handle any errors writing the file
        if (writeErr) {
          console.error(writeErr);
          throw new Error('Error writing to JSON file');
        }

        // Respond with the newly added contact
        res.json(newContact);
      },
    );
  });
});

// GET endpoint to fetch all contacts
router.get('/', (req: Request, res: Response) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    // Handle any errors reading the file
    if (err) {
      console.error(err);
      throw new Error('Error reading JSON file');
    }

    // Parse the JSON data
    const contacts: Contact[] = JSON.parse(data);

    // Send the contacts as a response
    res.json(contacts);
  });
});

// GET endpoint to fetch a specific contact and their friends by ID
router.get('/:id', (req: Request, res: Response) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    // Handle any errors reading the file
    if (err) {
      console.error(err);
      throw new Error('Error reading JSON file');
    }

    const contacts: Contact[] = JSON.parse(data);
    const requestedId: number = parseInt(req.params.id);

    // Use recursion to fetch contacts by ID
    const requestedContacts = fetchContactsById(contacts, requestedId);

    if (requestedContacts.length === 0) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    res.json(requestedContacts);
  });
});

// PUT endpoint to update a contact by ID
router.put('/:id', (req: Request, res: Response) => {
  const idToUpdate: number = parseInt(req.params.id);
  const updatedContact: Contact = req.body;

  fs.readFile(filePath, 'utf8', (err, data) => {
    // Handle any errors reading the file
    if (err) {
      console.error(err);
      throw new Error('Error reading JSON file');
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
        // Handle any errors writing the file
        if (writeErr) {
          console.error(writeErr);
          throw new Error('Error writing to JSON file');
        }

        // Respond with the updated contact
        res.json(contacts[contactIndex]);
      },
    );
  });
});

// DELETE endpoint to delete a contact by ID
router.delete('/:id', (req: Request, res: Response) => {
  const idToDelete: number = parseInt(req.params.id);

  fs.readFile(filePath, 'utf8', (err, data) => {
    // Handle any errors reading the file
    if (err) {
      console.error(err);
      throw new Error('Error reading JSON file');
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
        // Handle any errors writing the file
        if (writeErr) {
          console.error(writeErr);
          throw new Error('Error writing to JSON file');
        }

        // Respond with the deleted contact
        res.json(deletedContact);
      },
    );
  });
});

export default router;
