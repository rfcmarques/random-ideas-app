import IdeasApi from "../services/IdeasApi";

class IdeaList {
    constructor() {
        this._ideaListElm = document.querySelector('#idea-list');
        this._ideas = [];

        this.getIdeas();

        this._validTags = new Set();
        this._validTags.add('technology');
        this._validTags.add('software');
        this._validTags.add('business');
        this._validTags.add('education');
        this._validTags.add('health');
        this._validTags.add('inventions');

        this.addEventListners();
    }

    addEventListners() {
        this._ideaListElm.addEventListener('click', (e) => {
            if (e.target.classList.contains('fa-times')) {
                e.stopImmediatePropagation();
                const card = e.target.parentElement.parentElement;
                const ideaId = card.dataset.id;
                this.deleteIdea(ideaId);
            }
        })
    }

    async getIdeas() {
        try {
            const res = await IdeasApi.getIdeas();
            this._ideas = res.data.data;
            this.render();
        } catch (error) {
            console.log(error);
        }
    }

    async deleteIdea(ideaId) {
        try {
            const res = await IdeasApi.deleteIdea(ideaId);
            this._ideas.filter(idea => idea._id !== ideaId);
            this.getIdeas();
        } catch (error) {
            alert('You can not delete this resource');
        }
    }

    addIdeaToList(idea) {
        this._ideas.push(idea);
        this.render();
    }

    getTagClass(tag) {
        tag = tag.toLowerCase();
        let tagClass = '';
        if (this._validTags.has(tag)) {
            tagClass = `tag-${tag}`;
        } else {
            tagClass = '';
        }

        return tagClass;
    }

    render() {
        this._ideaListElm.innerHTML = this._ideas
            .map(idea => {
                const tagClass = this.getTagClass(idea.tag);
                const deleteBtn = idea.username === localStorage.getItem('username')
                    ? `<button class="delete"><i class="fas fa-times"></i></button>`
                    : '';
                return `
                <div class="card" data-id="${idea._id}">
                ${deleteBtn}
                <h3>
                  ${idea.text}
                </h3>
                <p class="tag ${tagClass}">${idea.tag.toUpperCase()}</p>
                <p>
                  Posted on <span class="date">${idea.date}</span> by
                  <span class="author">${idea.username}</span>
                </p>
              </div>
                `;
            })
            .join('');
    }
}

export default IdeaList;