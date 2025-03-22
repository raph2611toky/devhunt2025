from django.db import models
from apps.user.models import User  

class Course(models.Model):
    DOMAINES = [
        ('PROG', 'Programmation'),
        ('MATH', 'Mathématiques'),
        ('SCI', 'Sciences'),
        ('LANG', 'Langues'),
    ]
    STATUS = [
        ('Pend', 'Pending'),
        ('Publ', 'Published'),
    ]

    titre = models.CharField(max_length=200)
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses')
    domaine = models.CharField(max_length=4, choices=DOMAINES, default="Programmation")
    status = models.CharField(max_length=4, choices=STATUS, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.titre

    class Meta:
        db_table = 'course'

class Etape(models.Model):
    cours = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='etapes')
    titre = models.CharField(max_length=200)
    document = models.FileField(upload_to='courses/documents/', null=True, blank=True)
    video = models.FileField(upload_to='courses/videos/')
    ordre = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.cours.titre} - {self.titre}"

    class Meta:
        db_table = 'etape'
        ordering = ['ordre']

class Interrogation(models.Model):
    etape = models.ForeignKey(Etape, on_delete=models.CASCADE, related_name='etape')
    titre = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titre

    class Meta:
        db_table = 'interrogation'

class Question(models.Model):
    interrogation = models.ForeignKey(Interrogation, on_delete=models.CASCADE, related_name='questions')
    texte = models.TextField()
    ordre = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.texte[:50]

    class Meta:
        db_table = 'question'
        ordering = ['ordre']

class Reponse(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='reponses')
    texte = models.CharField(max_length=200)
    est_correcte = models.BooleanField(default=False)

    def __str__(self):
        return self.texte

    class Meta:
        db_table = 'reponse'
        
